import CompanyMonthlyCompensation from "./company/CompanyMonthlyCompensation";

export const UKPAY_TABLE_ROWS: ReadonlyArray<Row<any>> = [
  createRow<number>({
    label: "Salary",
    value: (compensation) => compensation.salary,
    formatter: formatCurrency,
    aggregate: sum,
  }),
  createRow<number>({
    label: "Bonus",
    value: (compensation) => compensation.bonus,
    formatter: formatCurrency,
    aggregate: sum,
  }),
  createRow<number>({
    label: "Taxable benefits",
    value: (compensation) => compensation.taxableBenefits,
    formatter: formatCurrency,
    aggregate: sum,
  }),
  createRow<number>({
    label: "Employee Pension %",
    value: (compensation) => compensation.pension.employee.percentage,
    formatter: formatPercent,
    aggregate: null,
  }),
  createRow<number>({
    label: "Employee Pension",
    value: (compensation) => compensation.pension.employee.amount,
    formatter: formatCurrency,
    aggregate: sum,
  }),
  createRow<number>({
    label: "Employer Pension %",
    value: (compensation) => compensation.pension.employer.percentage,
    formatter: formatPercent,
    aggregate: null,
  }),
  createRow<number>({
    label: "Employer Pension",
    value: (compensation) => compensation.pension.employer.amount,
    formatter: formatCurrency,
    aggregate: sum,
  }),
  createRow<number>({
    label: "Total Pension %",
    value: (compensation) =>
      compensation.pension.employee.percentage +
      compensation.pension.employer.percentage,
    formatter: formatPercent,
    aggregate: null,
  }),
  createRow<number>({
    label: "Total Pension",
    value: (compensation) =>
      compensation.pension.employee.amount +
      compensation.pension.employer.amount,
    formatter: formatCurrency,
    aggregate: sum,
  }),
];

type ValueFn<T> = (compensation: CompanyMonthlyCompensation) => T;
type AggregateFn<T> = (compensations: Array<CompanyMonthlyCompensation>) => T;
type Row<T> = {
  label: string;
  value: ValueFn<T>;
  formatter: (value: T) => string;
  aggregate: AggregateFn<T> | null;
};

function createRow<T>({
  label,
  value,
  formatter,
  aggregate,
}: {
  label: string;
  value: ValueFn<T>;
  formatter: (value: T) => string;
  aggregate: ((valueFn: ValueFn<T>) => AggregateFn<T>) | null;
}): Row<T> {
  return {
    label,
    value,
    formatter,
    aggregate: aggregate !== null ? aggregate(value) : null,
  };
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

function sum(valueFn: ValueFn<number>): AggregateFn<number> {
  return (compensations) =>
    compensations.reduce((acc, value) => acc + valueFn(value), 0);
}
