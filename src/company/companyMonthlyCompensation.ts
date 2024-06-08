import { Payslip } from "../payslip/payslip";

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

export type RSUData = {
  rsusTotalValue: number;
  rsusWithheld: number;
  rsusOverwithheldRefund: number;
};

export default abstract class CompanyMonthlyCompensation {
  constructor(public payslip: Payslip) {}

  abstract get salary(): number;
  abstract get bonus(): number;
  abstract get taxableBenefits(): number;

  abstract get pension(): PensionContribution;

  abstract get rsus(): RSUData;

  abstract get benefitsInKind(): number;

  abstract get totalPayment(): number;
  abstract get taxablePay(): number;

  abstract get taxPaid(): number;
  abstract get nationalInsurancePaid(): number;
}
