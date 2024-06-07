import { Payslip } from "../payslip/Payslip";

export type PensionContribution = {
  employee: {
    amount: number;
    percentage: number;
  };
  employer: {
    amount: number;
    percentage: number;
  };
};

export default abstract class CompanyMonthlyCompensation {
  constructor(public payslip: Payslip) {}

  abstract get salary(): number;
  abstract get bonus(): number;
  abstract get taxableBenefits(): number;

  abstract get pension(): PensionContribution;
}
