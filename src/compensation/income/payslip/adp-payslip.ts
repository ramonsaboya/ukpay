import { getDocument } from "pdfjs-dist";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";
import PayslipItemList from "src/compensation/income/payslip/paylist-item-list";
import Payslip from "src/compensation/income/payslip/payslip";
import TaxMonth, { taxMonthFromPeriod } from "src/hmrc/tax-month";

type PDFToken = {
  originalStr_DO_NOT_USE: string;
  cleanStr: string;
  x: number;
  y: number;
  width: number;
  numericForm: number | null;
};

const CHAR_WIDTH = 4.8;
const CHAR_HEIGHT = 8;
const CHAR_DELTA = 0.1;

export default class ADPPayslip extends Payslip {
  private constructor(
    taxMonth: TaxMonth,
    taxCode: string,
    earnings: PayslipItemList,
    deductions: PayslipItemList,
    grossBenefits: PayslipItemList
  ) {
    super();
    this._taxMonth = taxMonth;
    this._taxCode = taxCode;
    this._earnings = earnings;
    this._deductions = deductions;
    this._grossBenefits = grossBenefits;
  }

  public static async create(file: File): Promise<ADPPayslip> {
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

    const taxCode = getFirstItemValue(tokens, "TAX CODE");
    const taxMonth = taxMonthFromPeriod(
      Number(getFirstItemValue(tokens, "TAX PERIOD"))!
    );

    const earnings = findEarnings(tokens);
    const deductions = findDeductions(tokens);
    const grossBenefits = findGrossBenefits(tokens);

    return new ADPPayslip(
      taxMonth,
      taxCode,
      earnings,
      deductions,
      grossBenefits
    );
  }
}

function findEarnings(tokens: Array<PDFToken>): PayslipItemList {
  const top = getFirstToken(tokens, "PAYMENTS").y - CHAR_DELTA;
  const bottom =
    getFirstToken(tokens, "TOTAL PAYMENT").y +
    CHAR_HEIGHT + // height of the token itself has to be accounted for
    CHAR_DELTA;
  const right = getFirstToken(tokens, "DEDUCTIONS").x - CHAR_DELTA;

  const earnings = findTokensInBoundary(tokens, top, bottom, 0, right);

  return extractItems(earnings);
}

function findDeductions(tokens: Array<PDFToken>): PayslipItemList {
  const top = getFirstToken(tokens, "DEDUCTIONS").y - CHAR_DELTA;
  const bottom =
    getFirstToken(tokens, "TOTAL DEDUCTION").y +
    CHAR_HEIGHT + // height of the token itself has to be accounted for
    CHAR_DELTA;
  const left = getFirstToken(tokens, "DEDUCTIONS").x - CHAR_DELTA;
  const right = getFirstToken(tokens, "YEAR TO DATE").x - CHAR_DELTA;

  const deductions = findTokensInBoundary(tokens, top, bottom, left, right);

  return extractItems(deductions);
}

function findGrossBenefits(tokens: Array<PDFToken>): PayslipItemList {
  const top = getFirstToken(tokens, "GROSS BENEFITS").y - CHAR_DELTA;
  const left = getFirstToken(tokens, "GROSS BENEFITS").x - CHAR_DELTA;

  const grossBenefits = findTokensInBoundary(tokens, top, 0, left, Infinity);

  return extractItems(grossBenefits);
}

function getFirstToken(tokens: Array<PDFToken>, name: string): PDFToken {
  return tokens.find((token) => token.cleanStr === name)!;
}

function getFirstItemValue(tokens: Array<PDFToken>, name: string): string {
  return tokens[tokens.findIndex((token) => token.cleanStr === name)! + 1]
    .cleanStr;
}

function extractTokens(
  items: (TextItem | TextMarkedContent)[]
): Array<PDFToken> {
  return items
    .map((item) => {
      // setup base token
      const untypedItem: any = item;
      let token: PDFToken = {
        originalStr_DO_NOT_USE: untypedItem.str,
        cleanStr: untypedItem.str.toUpperCase(),
        x: untypedItem.transform[4],
        y: untypedItem.transform[5],
        width: untypedItem.width,
        numericForm: null,
      };

      const tokens: Array<PDFToken> = [];
      let runningLength = 0;
      // split token into words, adjusting width and position
      token.originalStr_DO_NOT_USE
        .split(" ")
        .forEach((originalStr_DO_NOT_USE) => {
          const length = originalStr_DO_NOT_USE.length * CHAR_WIDTH;

          let numericForm = null;
          const isNumber = /^-?\d{1,3}(,\d{3})*\.\d\d-?$/.test(
            originalStr_DO_NOT_USE
          );
          if (isNumber) {
            let numericStr = originalStr_DO_NOT_USE;
            const isSuffixNegativeNumber = /-$/.test(numericStr);
            if (isSuffixNegativeNumber) {
              numericStr = "-" + numericStr.slice(0, -1);
            }
            numericForm = Number(numericStr.replace(/,/g, ""));
          }

          tokens.push({
            originalStr_DO_NOT_USE,
            cleanStr: originalStr_DO_NOT_USE
              .toUpperCase()
              .replaceAll(/[*:]/g, ""),
            x: token.x + runningLength * CHAR_WIDTH,
            y: token.y,
            width: length,
            numericForm,
          } as PDFToken);

          runningLength += originalStr_DO_NOT_USE.length + 1;
        });
      return tokens;
    })
    .flat()
    .filter((token) => token.width > 0 && token.originalStr_DO_NOT_USE !== "")
    .filter(
      (token) =>
        token.originalStr_DO_NOT_USE !== ":" &&
        token.originalStr_DO_NOT_USE !== "*"
    );
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
      !prev.originalStr_DO_NOT_USE.endsWith(":");

    if (shouldMerge) {
      return [
        ...acc.slice(0, -1),
        {
          ...prev,
          originalStr_DO_NOT_USE: `${prev.originalStr_DO_NOT_USE} ${curr.originalStr_DO_NOT_USE}`,
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

function extractItems(tokens: Array<PDFToken>): PayslipItemList {
  const uniqueItems = tokens.reduce((acc, curr, idx) => {
    const itemName = curr.cleanStr;

    if (acc.size === 0) {
      return acc.set(itemName, 0);
    }

    if (curr.numericForm != null) {
      const prev = tokens[idx - 1];

      return acc.set(prev.cleanStr, acc.get(prev.cleanStr)! + curr.numericForm);
    } else {
      return acc.set(itemName, acc.get(itemName) ?? 0);
    }
  }, new Map() as Map<string, number>);

  const list = new PayslipItemList();
  Array.from(uniqueItems.entries()).forEach(([name, amount]) =>
    list.add({ name, amount })
  );
  return list;
}
