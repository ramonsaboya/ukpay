import { CompensationElementType } from "src/compensation/element/compensation-element";
import RSUOverwithheldRefund from "src/compensation/element/rsu-overwithheld-refund";
import { IManualFixedIncome } from "src/compensation/income/manual-fixed-income";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaRSUOverwithheldRefund
  extends RSUOverwithheldRefund
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();

  fromManualFixedIncome(manualFixedIncome: MetaManualFixedIncome): number {
    return manualFixedIncome.rsuOverwithheldRefund;
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.getOrDefault("RSU EXCS REFUND", 0);
  }
}
