import { formatCurrency } from "../ukPayRows";
import { BandWithThreshold, TaxYear } from "./tax_year/taxYearBuilder";
import { CompanyCompensation } from "../state/ukPayState";
import { TableCell, TableRow } from "@mui/material";
import { useUKPayState } from "../state/UKPayDispatchContext";
import taxYear2023_24 from "./tax_year/taxYear2023_24";
import { TAX_PERIODS } from "../taxPeriod";
import { Map } from "immutable";

export function NationalInsuranceRows() {
  const { companyCompensation } = useUKPayState();
  const taxYear = taxYear2023_24;

  const bandsForTaxYear = taxYear
    .reduce((acc, taxYearMonth) => {
      taxYearMonth.nationalInsuranceRates.forEach((band) => {
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

  const nationalInsurance = calculateNationalInsurance(
    companyCompensation,
    taxYear
  );

  console.log(nationalInsurance.toObject());

  return (
    <>
      {bandsForTaxYear.map((band) => (
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

            const payAtBand = nationalInsurance
              .get(taxPeriodId)
              ?.bands.find(
                ({ band: searchBand }) => searchBand.name === band.name
              )?.payAtBand;
            return (
              <TableCell align="right" key={reactKey}>
                {payAtBand ? formatCurrency(payAtBand) : "-"}
              </TableCell>
            );
          })}
          <TableCell>
            {formatCurrency(
              nationalInsurance.reduce(
                (acc, { bands: searchBands }) =>
                  acc +
                  (searchBands.find(
                    (searchBand) => searchBand.band.name === band.name
                  )?.niAtBand ?? 0),
                0
              )
            )}
          </TableCell>
        </TableRow>
      ))}
      <TableRow>
        <TableCell>NI paid</TableCell>
        {TAX_PERIODS.valueSeq().map(({ id: taxPeriodId, month }) => {
          const compensation = companyCompensation.get(taxPeriodId);
          const reactKey = `totalNIPaid-${month}`;

          if (compensation == null) {
            return (
              <TableCell align="right" key={reactKey}>
                -
              </TableCell>
            );
          }

          return (
            <TableCell align="right" key={reactKey}>
              {formatCurrency(nationalInsurance.get(taxPeriodId)!.total)}
            </TableCell>
          );
        })}
        <TableCell>
          {formatCurrency(
            nationalInsurance.reduce((acc, { total }) => acc + total, 0)
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

type NationalInsurance = Map<
  number,
  {
    total: number;
    bands: Array<{
      band: BandWithThreshold;
      niAtBand: number;
      payAtBand: number;
    }>;
  }
>;

function calculateNationalInsurance(
  companyCompensation: CompanyCompensation,
  taxYear: TaxYear
): NationalInsurance {
  let nationalInsurance: NationalInsurance = Map();

  companyCompensation.forEach((compensation) => {
    const periodId = compensation.payslip.period.id;

    const bands = taxYear[periodId - 1].nationalInsuranceRates.map((band) => {
      const upperLimit = band.annualUpperLimit / 12;
      const lowerLimit = band.annualLowerLimit / 12;

      const payAtBand = Math.max(
        0,
        Math.min(compensation.taxablePay, upperLimit) - lowerLimit
      );
      const niAtBand = payAtBand * band.rate;

      return {
        band,
        niAtBand,
        payAtBand,
      };
    });

    nationalInsurance = nationalInsurance.set(periodId, {
      total: bands.reduce((acc, { niAtBand }) => acc + niAtBand, 0),
      bands,
    });
  });

  return nationalInsurance;
}
