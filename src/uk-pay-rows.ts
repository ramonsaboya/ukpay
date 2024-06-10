import { formatCurrency } from "src/compensation/formatters";

export const UKPAY_TABLE_ROWS: ReadonlyArray<UKPayRow<any>> = [
  createNumberRow("Salary", (compensation) => compensation.salary),
  createNumberRow("Bonus", (compensation) => compensation.bonus),
  createNumberRow(
    "Taxable benefits",
    (compensation) => compensation.taxableBenefits
  ),
  createNumberRow(
    "Employee Pension %",
    (compensation) => compensation.pension.employee.percentage,
    formatPercent,
    null
  ),
  createNumberRow(
    "Employee Pension",
    (compensation) => compensation.pension.employee.amount
  ),
  createNumberRow(
    "Employer Pension %",
    (compensation) => compensation.pension.employer.percentage,
    formatPercent,
    null
  ),
  createNumberRow(
    "Employer Pension",
    (compensation) => compensation.pension.employer.amount
  ),
  createNumberRow(
    "Total Pension %",
    (compensation) =>
      compensation.pension.employee.percentage +
      compensation.pension.employer.percentage,
    formatPercent,
    null
  ),
  createNumberRow(
    "Total Pension",
    (compensation) =>
      compensation.pension.employee.amount +
      compensation.pension.employer.amount
  ),
  createNumberRow("RSUs", (compensation) => compensation.rsus.rsusTotalValue),
  createNumberRow(
    "RSU Tax Offset",
    (compensation) => compensation.rsus.rsusWithheld
  ),
  createNumberRow(
    "RSU Excs Refund",
    (compensation) => compensation.rsus.rsusOverwithheldRefund
  ),
  createNumberRow(
    "Benefits in Kind",
    (compensation) => compensation.benefitsInKind
  ),
  createNumberRow("Total payment", (compensation) => compensation.totalPayment),
  createNumberRow("Taxable pay", (compensation) => compensation.taxablePay),
  createNumberRow(
    "Adjusted income",
    (compensation) =>
      compensation.taxablePay +
      compensation.pension.employee.amount +
      compensation.pension.employer.amount
  ),
  createNumberRow("Tax paid", (compensation) => compensation.taxPaid),
  createNumberRow(
    "National Insurance paid",
    (compensation) => compensation.nationalInsurancePaid
  ),
  createNumberRow(
    "Net pay",
    (compensation) =>
      compensation.totalPayment -
      compensation.taxPaid -
      compensation.nationalInsurancePaid
  ),
  createNumberRow(
    "Net income",
    (compensation) =>
      compensation.totalPayment -
      compensation.taxPaid -
      compensation.nationalInsurancePaid +
      compensation.rsus.rsusTotalValue -
      compensation.rsus.rsusWithheld -
      compensation.rsus.rsusOverwithheldRefund
  ),
];

type ValueFn<T> = (compensation: any) => T;
type AggregateFn<T> = (compensations: Array<any>) => T;
export type UKPayRow<T> = {
  label: string;
  value: ValueFn<T>;
  formatter: (value: T) => string;
  aggregate: AggregateFn<T> | null;
};

function createRow<T>(
  label: string,
  value: UKPayRow<T>["value"],
  formatter: UKPayRow<T>["formatter"],
  aggregate: ((valueFn: ValueFn<T>) => AggregateFn<T>) | null
): UKPayRow<T> {
  return {
    label,
    value,
    formatter,
    aggregate: aggregate !== null ? aggregate(value) : null,
  };
}

export function createNumberRow(
  label: string,
  value: UKPayRow<number>["value"],
  formatter: UKPayRow<number>["formatter"] = formatCurrency,
  aggregate: ((valueFn: ValueFn<number>) => AggregateFn<number>) | null = sum
): UKPayRow<number> {
  return createRow(label, value, formatter, aggregate);
}

// TODO should these functions be somewhere else?

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

function sum(valueFn: ValueFn<number>): AggregateFn<number> {
  return (compensations) =>
    compensations.reduce((acc, value) => acc + valueFn(value), 0);
}
