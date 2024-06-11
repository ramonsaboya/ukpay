import { CompensationElementType } from "src/compensation/element/compensation-element";
import Salary from "src/compensation/element/salary";
import { IManualFixedIncome } from "src/compensation/income/manual-fixed-income";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaSalary
  extends Salary
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();

  fromManualFixedIncome(manualFixedIncome: MetaManualFixedIncome): number {
    return manualFixedIncome.salary;
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.sum("SALARY", "COMPANY SICKPAY", "PAYABLE SSP");
  }
}
