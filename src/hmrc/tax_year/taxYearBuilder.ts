export type BandWithThreshold = {
  name: string;
  rate: number;
  annualLowerLimit: number;
  annualUpperLimit: number;
};

export type TaxYearMonth = {
  personalAllowance: number;
  taxRates: Array<BandWithThreshold>;
};
export type TaxYear = [
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth,
  TaxYearMonth
];

export default function taxYearBuilder(
  ...repeatingTaxYearMonths: [number, TaxYearMonth][]
): TaxYear {
  if (
    repeatingTaxYearMonths.reduce(
      (acc, [repeatingTimes]) => acc + repeatingTimes,
      0
    ) !== 12
  ) {
    throw new Error("The sum of repeating times should be 12");
  }

  return repeatingTaxYearMonths.reduce(
    (acc, [repeatingTimes, taxYearMonth]) => {
      for (let i = 0; i < repeatingTimes; i++) {
        acc.push(taxYearMonth);
      }
      return acc;
    },
    [] as TaxYearMonth[]
  ) as TaxYear;
}
