import { getDocument } from "pdfjs-dist";
import { PayslipData, PayslipItems } from "./PayslipData";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

type PDFToken = {
  str: string;
  cleanStr: string;
  x: number;
  y: number;
  width: number;
  numericForm: number | null;
};

const CHAR_WIDTH = 4.8;
const CHAR_HEIGHT = 8;
const CHAR_DELTA = 0.1;

export default async function processADPPayslip(
  file: File
): Promise<PayslipData> {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument(buffer).promise;

  let tokens = [];
  const maxPages = pdf.numPages;
  for (let j = 1; j <= maxPages; j++) {
    const page = await pdf.getPage(j);
    const text = await page.getTextContent();
    tokens.push(extractTokens(text.items));
  }
  tokens = tokens.flat();

  tokens = mergeConnectedTokens(tokens);

  const taxCode =
    tokens[tokens.findIndex((token) => token.str === "TAX CODE")! + 1].str;
  const taxPeriod = Number(
    tokens[tokens.findIndex((token) => token.str === "TAX PERIOD")! + 1].str
  );

  const topTablesTopY =
    tokens.find((token) => token.str === "PAYMENTS")!.y - CHAR_DELTA;
  const topTablesBottomY =
    tokens.find((token) => token.str === "TOTAL PAYMENT:")!.y +
    CHAR_HEIGHT + // height of the token itself has to be accounted for
    CHAR_DELTA;
  const topTablesRightX =
    tokens.find((token) => token.str === "DEDUCTIONS")!.x - CHAR_DELTA;

  const bottomTablesTopY =
    tokens.find((token) => token.str === "GROSS BENEFITS")!.y - CHAR_DELTA;
  const bottomTablesLeftX =
    tokens.find((token) => token.str === "GROSS BENEFITS")!.x - CHAR_DELTA;

  const periodEarnings = findTokensInBoundary(
    tokens,
    topTablesTopY,
    topTablesBottomY,
    0,
    topTablesRightX
  );
  const periodGrossBenefits = findTokensInBoundary(
    tokens,
    bottomTablesTopY,
    0,
    bottomTablesLeftX,
    Infinity
  );

  return {
    taxCode,
    taxPeriod,
    earningsItems: extractItems(periodEarnings),
    benefitsItems: extractItems(periodGrossBenefits),
  };
}

function extractTokens(
  items: (TextItem | TextMarkedContent)[]
): Array<PDFToken> {
  return items
    .map((item) => {
      // setup base token
      const untypedItem: any = item;
      let token: PDFToken = {
        str: untypedItem.str.toUpperCase(),
        cleanStr: untypedItem.str.toUpperCase(),
        x: untypedItem.transform[4],
        y: untypedItem.transform[5],
        width: untypedItem.width,
        numericForm: null,
      };

      const tokens: Array<PDFToken> = [];
      let runningLength = 0;
      // split token into words, adjusting width and position
      token.str.split(" ").forEach((str) => {
        const length = str.length * CHAR_WIDTH;

        let numericForm = null;
        const isNumber = /^-?\d{1,3}(,\d{3})*\.\d\d-?$/.test(str);
        if (isNumber) {
          let numericStr = str;
          const isSuffixNegativeNumber = /-$/.test(numericStr);
          if (isSuffixNegativeNumber) {
            numericStr = "-" + numericStr.slice(0, -1);
          }
          numericForm = Number(numericStr.replace(/,/g, ""));
        }

        tokens.push({
          str,
          cleanStr: str.replaceAll(/[*:]/g, ""),
          x: token.x + runningLength * CHAR_WIDTH,
          y: token.y,
          width: length,
          numericForm,
        } as PDFToken);

        runningLength += str.length + 1;
      });
      return tokens;
    })
    .flat()
    .filter((token) => token.width > 0 && token.str !== "")
    .filter((token) => token.str !== ":" && token.str !== "*");
}

function mergeConnectedTokens(tokens: Array<PDFToken>): Array<PDFToken> {
  return tokens.reduce((acc, curr) => {
    if (acc.length === 0) {
      return [curr];
    }

    const prev = acc[acc.length - 1];
    const shouldMerge =
      Math.abs(curr.x - (prev.x + prev.width) - CHAR_WIDTH) < CHAR_DELTA &&
      prev.numericForm == null &&
      curr.numericForm == null &&
      !prev.str.endsWith(":");

    if (shouldMerge) {
      return [
        ...acc.slice(0, -1),
        {
          ...prev,
          str: `${prev.str} ${curr.str}`,
          cleanStr: `${prev.cleanStr} ${curr.cleanStr}`,
          width: prev.width + CHAR_WIDTH + curr.width,
        },
      ];
    } else {
      return [...acc, curr];
    }
  }, [] as Array<PDFToken>);
}

function findTokensInBoundary(
  tokens: Array<PDFToken>,
  top: number,
  bottom: number,
  left: number,
  right: number
): Array<PDFToken> {
  return tokens.filter(
    (token) =>
      token.y + CHAR_HEIGHT < top &&
      token.y > bottom &&
      token.x > left &&
      token.x + token.width <= right
  );
}

function extractItems(tokens: Array<PDFToken>): PayslipItems {
  return tokens.reduce((acc, curr, idx) => {
    const itemName = curr.cleanStr;

    if (acc.length === 0) {
      return { [itemName]: 0 };
    }

    if (curr.numericForm != null) {
      const prev = tokens[idx - 1];

      return {
        ...acc,
        [prev.cleanStr]: acc[prev.cleanStr] + curr.numericForm,
      };
    } else {
      return { ...acc, [itemName]: acc[itemName] ?? 0 };
    }
  }, {} as PayslipItems);
}
