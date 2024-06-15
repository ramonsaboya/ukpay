import TaxMonth, { taxMonthFromPeriod } from "src/hmrc/tax-month";
import { z } from "zod";

export type BandWithThreshold = {
  rate: number;
  annualLowerLimit: number;
  annualUpperLimit: number;
};

export type TaxYearMonth = {
  personalAllowance: number;
  taxRates: Array<BandWithThreshold>;
  nationalInsuranceRates: Array<BandWithThreshold>;
};
export type TaxYear = {
  key: string;
  taxYearMonths: Map<TaxMonth, TaxYearMonth>;
};

export const TAX_YEARS: Map<string, TaxYear> = new Map();

export function loadTaxYears(): void {
  const context = require.context("./tax-years", true, /\.json$/);
  context.keys().forEach((key: any) => {
    const fileName = key.replace("./", "");
    const resource = require(`./tax-years/${fileName}`);
    const taxYearKey = fileName.replace(".json", "").replace("-", "/");
    const schematizedTaxYear = TAX_YEAR_SCHEMA.parse(
      JSON.parse(JSON.stringify(resource))
    );
    const taxYear = convertTaxYearFromSchema(taxYearKey, schematizedTaxYear);
    if (taxYear.taxYearMonths.size !== 12) {
      throw new Error("Expected 12 tax year months to be loaded");
    }
    TAX_YEARS.set(taxYearKey, taxYear);
  });
  console.log(TAX_YEARS);
}

function convertTaxYearFromSchema(
  key: string,
  schematizedTaxYear: z.infer<typeof TAX_YEAR_SCHEMA>
): TaxYear {
  const taxYearMonths = new Map<TaxMonth, TaxYearMonth>();

  for (const taxYearMonth of schematizedTaxYear) {
    const [startMonth, endMonth] = taxYearMonth.months;
    const settings = taxYearMonth.settings;

    for (let month = startMonth; month <= endMonth; month++) {
      taxYearMonths.set(taxMonthFromPeriod(month), {
        personalAllowance: settings.personalAllowance,
        taxRates: settings.taxRates.map((schematizedBand) =>
          convertBandWithThresholdFromSchema(schematizedBand)
        ),
        nationalInsuranceRates: settings.nationalInsuranceRates.map(
          (schematizedBand) =>
            convertBandWithThresholdFromSchema(schematizedBand)
        ),
      });
    }
  }
  return { taxYearMonths, key };
}
function convertBandWithThresholdFromSchema(
  bandWithThreshold: z.infer<typeof BAND_WITH_THRESHOLD_SCHEMA>
): BandWithThreshold {
  return {
    rate: bandWithThreshold.rate,
    annualLowerLimit: bandWithThreshold.annualLowerLimit,
    annualUpperLimit: bandWithThreshold.annualUpperLimit ?? Infinity,
  };
}

const BAND_WITH_THRESHOLD_SCHEMA = z.object({
  rate: z.number().min(0),
  annualLowerLimit: z.number().min(0),
  annualUpperLimit: z.number().min(0).nullable(),
});
const TAX_YEAR_SCHEMA = z.array(
  z.object({
    months: z.tuple([z.number().min(0), z.number().max(12)]),
    settings: z.object({
      personalAllowance: z.number().min(0),
      taxRates: z.array(BAND_WITH_THRESHOLD_SCHEMA),
      nationalInsuranceRates: z.array(BAND_WITH_THRESHOLD_SCHEMA),
    }),
  })
);
