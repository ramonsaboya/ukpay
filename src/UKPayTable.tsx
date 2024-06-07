import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  TaxPeriodAmounts,
  TaxPeriodData,
  TaxPeriods,
} from "./state/ukPayState";
import { Map } from "immutable";
import { useUKPayState } from "./state/UKPayDispatchContext";
import { getEmployerPensionMatch } from "./meta/metaPensionScheme";

type FormatFn = (value: any) => string;
type ValueFn = (period: TaxPeriodAmounts) => number;
type TotalFn = (periods: TaxPeriods) => number;

type Row = {
  key: string;
  label: string;
  valueFn: ValueFn;
  totalFn: TotalFn | null;
  formatFn: FormatFn;
  type: "real" | "virtual";
};

const ROWS: ReadonlyArray<Row> = [
  realRow({
    key: "salary",
    label: "Salary",
  }),
  realRow({
    key: "bonus",
    label: "Bonus",
  }),
  realRow({
    key: "wellness",
    label: "Wellness",
  }),
  realRow({
    key: "transportation",
    label: "Transportation",
  }),
  realRow({
    key: "employeePensionContributionPercent",
    stateKey: "pensionContribution",
    label: "Employee pension contribution %",
    formatFn: formatPercent,
    totalFn: null,
  }),
  virtualRow({
    key: "employerPensionContributionPercent",
    label: "Employer pension contribution %",
    valueFn: (period) => getEmployerPensionMatch(period.pensionContribution),
    formatFn: formatPercent,
    totalFn: null,
  }),
  virtualRow({
    key: "totalPensionContributionPercent",
    label: "Total pension contribution %",
    valueFn: (period) =>
      period.pensionContribution +
      getEmployerPensionMatch(period.pensionContribution),
    formatFn: formatPercent,
    totalFn: null,
  }),
  virtualRow({
    key: "employeePensionContribution",
    label: "Employee pension contribution",
    valueFn: ({ salary, pensionContribution }) =>
      (salary * pensionContribution) / 100,
  }),
  virtualRow({
    key: "employerPensionContribution",
    label: "Employer pension contribution",
    valueFn: ({ salary, pensionContribution }) =>
      (salary * getEmployerPensionMatch(pensionContribution)) / 100,
  }),
  virtualRow({
    key: "totalPensionContribution",
    label: "Total pension contribution",
    valueFn: ({ salary, pensionContribution }) =>
      (salary *
        (pensionContribution + getEmployerPensionMatch(pensionContribution))) /
      100,
  }),
  virtualRow({
    key: "totalPayment",
    label: "Total payment",
    valueFn: (period) =>
      period.salary +
      period.bonus +
      period.wellness +
      period.transportation +
      period.rsuTaxOffset +
      period.rsuExcsRefund -
      (period.salary * period.pensionContribution) / 100,
  }),
  realRow({
    key: "rsuTaxOffset",
    label: "RSU Tax Offset",
  }),
  realRow({
    key: "rsuExcsRefund",
    label: "RSU Excs Refund",
  }),
  realRow({
    key: "rsuTotal",
    label: "RSUs",
  }),
  realRow({
    key: "benefitsInKind",
    label: "Benefits in kind",
  }),
];

export default function UKPayTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {PERIOD_TO_MONTH.valueSeq().map((month) => (
              <TableCell key={month}>{month}</TableCell>
            ))}
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Rows />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Rows() {
  const { periods } = useUKPayState();

  return (
    <>
      {ROWS.map(({ key, label, totalFn, formatFn, valueFn }) => (
        <TableRow key={key}>
          <TableCell>{label}</TableCell>

          {periods.valueSeq().map((period) => (
            <TableCell key={getCellKey(key, period)} align="right">
              {formatFn(valueFn(period.amounts))}
            </TableCell>
          ))}

          <TableCell align="right">
            {totalFn != null ? formatFn(totalFn(periods)) : ""}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function getCellKey(key: string, period: TaxPeriodData): string {
  return `${key}-${PERIOD_TO_MONTH.get(period.setup.taxPeriod.toString())}`;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

function sum(valueFn: ValueFn): TotalFn {
  return (periods) =>
    periods.reduce((acc, curr) => valueFn(curr.amounts) + acc, 0);
}

type RealRowParams = (
  | { key: keyof TaxPeriodAmounts; stateKey?: never }
  | { key: string; stateKey: keyof TaxPeriodAmounts }
) & {
  label: string;
  totalFn?: TotalFn | null;
  formatFn?: FormatFn;
};
function realRow({
  key,
  label,
  stateKey,
  totalFn,
  formatFn,
}: RealRowParams): Row {
  const valueFn: ValueFn = (period) => period[stateKey ?? key];

  return {
    key,
    label,
    valueFn,
    totalFn: totalFn === undefined ? sum(valueFn) : totalFn,
    formatFn: formatFn ?? formatCurrency,
    type: "real",
  };
}

type VirtualRowParams = {
  key: string;
  label: string;
  valueFn: ValueFn;
  totalFn?: TotalFn | null;
  formatFn?: FormatFn;
};
function virtualRow({
  key,
  label,
  valueFn,
  totalFn,
  formatFn,
}: VirtualRowParams): Row {
  return {
    key,
    label,
    valueFn,
    totalFn: totalFn === undefined ? sum(valueFn) : totalFn,
    formatFn: formatFn ?? formatCurrency,
    type: "virtual",
  };
}

const PERIOD_TO_MONTH = Map({
  1: "April",
  2: "May",
  3: "June",
  4: "July",
  5: "August",
  6: "September",
  7: "October",
  8: "November",
  9: "December",
  10: "January",
  11: "February",
  12: "March",
});
