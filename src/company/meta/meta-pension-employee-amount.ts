import { CompensationElementType } from "src/compensation/element/compensation-element";
import PensionEmployeeAmount from "src/compensation/element/pension-employee-amount";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaPensionEmployeeAmount
  extends PensionEmployeeAmount
  implements IPayslip
{
  dependencies = new Set<CompensationElementType>();

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.getOrDefault("AE PENSION EE", 0) * -1;
  }
}
