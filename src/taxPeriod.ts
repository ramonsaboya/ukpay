import { Map } from "immutable";

export type TaxPeriod =
  | { id: 1; month: "April" }
  | { id: 2; month: "May" }
  | { id: 3; month: "June" }
  | { id: 4; month: "July" }
  | { id: 5; month: "August" }
  | { id: 6; month: "September" }
  | { id: 7; month: "October" }
  | { id: 8; month: "November" }
  | { id: 9; month: "December" }
  | { id: 10; month: "January" }
  | { id: 11; month: "February" }
  | { id: 12; month: "March" };

const aprilTaxPeriod: TaxPeriod = {
  id: 1,
  month: "April",
};
const mayTaxPeriod: TaxPeriod = {
  id: 2,
  month: "May",
};
const juneTaxPeriod: TaxPeriod = {
  id: 3,
  month: "June",
};
const julyTaxPeriod: TaxPeriod = {
  id: 4,
  month: "July",
};
const augustTaxPeriod: TaxPeriod = {
  id: 5,
  month: "August",
};
const septemberTaxPeriod: TaxPeriod = {
  id: 6,
  month: "September",
};
const octoberTaxPeriod: TaxPeriod = {
  id: 7,
  month: "October",
};
const novemberTaxPeriod: TaxPeriod = {
  id: 8,
  month: "November",
};
const decemberTaxPeriod: TaxPeriod = {
  id: 9,
  month: "December",
};
const januaryTaxPeriod: TaxPeriod = {
  id: 10,
  month: "January",
};
const februaryTaxPeriod: TaxPeriod = {
  id: 11,
  month: "February",
};
const marchTaxPeriod: TaxPeriod = {
  id: 12,
  month: "March",
};

export const TAX_PERIODS: Map<number, TaxPeriod> = Map(
  [
    aprilTaxPeriod,
    mayTaxPeriod,
    juneTaxPeriod,
    julyTaxPeriod,
    augustTaxPeriod,
    septemberTaxPeriod,
    octoberTaxPeriod,
    novemberTaxPeriod,
    decemberTaxPeriod,
    januaryTaxPeriod,
    februaryTaxPeriod,
    marchTaxPeriod,
  ].map((period) => [period.id, period])
);
