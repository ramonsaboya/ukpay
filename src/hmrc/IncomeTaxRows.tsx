import { formatCurrency } from "../ukPayRows";
import { BandWithThreshold, TaxYear } from "./tax_year/taxYearBuilder";
import { CompanyCompensation } from "../state/ukPayState";
import { TableCell, TableRow } from "@mui/material";
import { useUKPayState } from "../state/UKPayDispatchContext";
import taxYear2023_24 from "./tax_year/taxYear2023_24";
import { TAX_PERIODS } from "../taxPeriod";
import { Map } from "immutable";

export function IncomeTaxRows() {
  const { companyCompensation } = useUKPayState();
  const taxYear = taxYear2023_24;

  const bandsForTaxYear = taxYear
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

  const incomeTax = calculateIncomeTax(
    companyCompensation,
    taxYear,
    bandsForTaxYear
  );

  return (
    <>
      {bandsForTaxYear.map((band, idx) => (
        <TableRow key={band.name}>
          <TableCell>{band.name}</TableCell>
          {TAX_PERIODS.valueSeq().map(({ id: taxPeriodId, month }) => {
            const compensation = companyCompensation.get(taxPeriodId);
            const reactKey = `${band.name}-${month}`;

            if (compensation == null) {
              return (
                <TableCell align="right" key={reactKey}>
                  -
                </TableCell>
              );
            }

            return (
              <TableCell align="right" key={reactKey}>
                {formatCurrency(
                  incomeTax.get(taxPeriodId)!.bands[idx].payAtBand
                )}
              </TableCell>
            );
          })}
          <TableCell></TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell>Tax paid</TableCell>
        {TAX_PERIODS.valueSeq().map(({ id: taxPeriodId, month }) => {
          const compensation = companyCompensation.get(taxPeriodId);
          const reactKey = `totalTaxPaid-${month}`;

          if (compensation == null) {
            return (
              <TableCell align="right" key={reactKey}>
                -
              </TableCell>
            );
          }

          return (
            <TableCell align="right" key={reactKey}>
              {formatCurrency(incomeTax.get(taxPeriodId)!.total)}
            </TableCell>
          );
        })}
        <TableCell>
          {formatCurrency(incomeTax.reduce((acc, { total }) => acc + total, 0))}
        </TableCell>
      </TableRow>
    </>
  );
}

type IncomeTax = Map<
  number,
  {
    total: number;
    bands: Array<{
      band: BandWithThreshold;
      taxAtBand: number;
      payAtBand: number;
    }>;
  }
>;

function calculateIncomeTax(
  companyCompensation: CompanyCompensation,
  taxYear: TaxYear,
  bandsForTaxYear: BandWithThreshold[]
): IncomeTax {
  let cumulativeTaxablePay = 0;
  let cumulativeTaxPaid = 0;

  let incomeTax: IncomeTax = Map();

  companyCompensation.forEach((compensation) => {
    const periodId = compensation.payslip.period.id;

    cumulativeTaxablePay += compensation.taxablePay;

    // TODO improve handling of periodId all over the place. It's a mess, some places are using 0-based, some 1-based.
    const bands = bandsForTaxYear.map((band) => {
      const cumulativeUpperLimit = (band.annualUpperLimit / 12) * periodId;
      const cumulativeLowerLimit = (band.annualLowerLimit / 12) * periodId;

      const payAtBand = Math.max(
        0,
        Math.min(cumulativeTaxablePay, cumulativeUpperLimit) -
          cumulativeLowerLimit
      );
      const taxAtBand = payAtBand * band.rate;

      return {
        band,
        taxAtBand,
        payAtBand,
      };
    });

    incomeTax = incomeTax.set(periodId, {
      total:
        bands.reduce((acc, { taxAtBand }) => acc + taxAtBand, 0) -
        cumulativeTaxPaid,
      bands,
    });

    cumulativeTaxPaid += incomeTax.get(periodId)!.total;
  });

  return incomeTax;
}
