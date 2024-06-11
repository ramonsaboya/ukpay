import { CompensationElementType } from "src/compensation/element/compensation-element";
import Salary from "src/compensation/element/salary";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "src/compensation/income/manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaSalary
  extends Salary
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();

  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): number {
    throw new Error("Method not implemented.");
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.sum("SALARY", "COMPANY SICKPAY", "PAYABLE SSP");
  }
}
