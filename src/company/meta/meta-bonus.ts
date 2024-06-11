import Bonus from "src/compensation/element/bonus";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "src/compensation/income/manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaBonus
  extends Bonus
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();

  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): number {
    throw new Error("Method not implemented.");
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.getOrDefault("PERFORM BONUS", 0);
  }
}
