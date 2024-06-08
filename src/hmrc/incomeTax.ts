import CompanyMonthlyCompensation from "../company/companyMonthlyCompensation";
import { createNumberRow, UKPayRow } from "../ukPayRows";
import {
  BandWithThreshold,
  TaxYear,
  TaxYearMonth,
} from "./tax_year/taxYearBuilder";

export type IncomeTax = {
  total: number;
  bands: Array<{
    band: BandWithThreshold;
    taxAtBand: number;
    payAtBand: number;
  }>;
};

export function calculateIncomeTax(
  companyMonthlyCompensation: CompanyMonthlyCompensation,
  taxYearMonth: TaxYearMonth
): IncomeTax {
  const taxablePay = companyMonthlyCompensation.taxablePay;
  const incomeTax: IncomeTax = {
    total: 0,
    bands: [],
  };
  taxYearMonth.taxRates.forEach((band) => {
    const payAtBand = Math.max(
      0,
      Math.min(taxablePay, band.annualUpperLimit / 12) -
        band.annualLowerLimit / 12
    );
    const taxAtBand = payAtBand * band.rate;
    incomeTax.total += taxAtBand;
    incomeTax.bands.push({
      band,
      taxAtBand,
      payAtBand,
    });
  });

  return incomeTax;
}

export function createIncomeTaxRows(taxYear: TaxYear): Array<UKPayRow<number>> {
  const bands = taxYear
    .reduce((acc, taxYearMonth) => {
      taxYearMonth.taxRates.forEach((band) => {
        if (acc.find(({ name }) => name === band.name) === undefined) {
          acc.push(band);
        }
      });
      return acc;
    }, [] as BandWithThreshold[])
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

  return [
    ...bands.map((band) =>
      createNumberRow(
        band.name,
        (compensation) =>
          calculateIncomeTax(
            compensation,
            taxYear[compensation.payslip.period.id - 1]!
          ).bands.find(({ band: { name } }) => name === band.name)!.payAtBand
      )
    ),
    createNumberRow(
      "Tax paid",
      (compensation) =>
        calculateIncomeTax(
          compensation,
          taxYear[compensation.payslip.period.id - 1]!
        ).total
    ),
  ];
}
