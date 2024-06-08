import CompanyMonthlyCompensation from "./company/companyMonthlyCompensation";

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
  createNumberRow(
    "RSUs (GBP)",
    (compensation) => compensation.rsus.rsusTotalValue
  ),
  // TODO fix USD conversion rate
  createNumberRow(
    "RSUs (USD)",
    (compensation) => compensation.rsus.rsusTotalValue * 1.25,
    formatCurrencyUSD
  ),
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
  createNumberRow(
    "Total payment",
    (compensation) =>
      compensation.salary +
      compensation.bonus +
      compensation.taxableBenefits +
      compensation.rsus.rsusWithheld +
      compensation.rsus.rsusOverwithheldRefund -
      compensation.pension.employee.amount
  ),
  createNumberRow("Taxable pay", (compensation) => compensation.taxablePay),
  createNumberRow(
    "Adjusted income",
    (compensation) =>
      compensation.taxablePay +
      compensation.pension.employee.amount +
      compensation.pension.employer.amount
  ),
];

type ValueFn<T> = (compensation: CompanyMonthlyCompensation) => T;
type AggregateFn<T> = (compensations: Array<CompanyMonthlyCompensation>) => T;
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

function formatCurrency(value: number): string {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

function formatCurrencyUSD(value: number): string {
  return value
    .toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
    .replace(/^US/, "");
}

function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

function sum(valueFn: ValueFn<number>): AggregateFn<number> {
  return (compensations) =>
    compensations.reduce((acc, value) => acc + valueFn(value), 0);
}
