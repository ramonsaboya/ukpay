import { CompensationElementType } from "src/compensation/element/compensation-element";
import RSUOverwithheldRefund from "src/compensation/element/rsu-overwithheld-refund";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaRSUOverwithheldRefund
  extends RSUOverwithheldRefund
  implements IPayslip
{
  dependencies = new Set<CompensationElementType>();

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.getOrDefault("RSU EXCS REFUND", 0);
  }
}
