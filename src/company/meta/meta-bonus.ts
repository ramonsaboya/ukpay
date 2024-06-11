import Bonus from "src/compensation/element/bonus";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import { IManualFixedIncome } from "src/compensation/income/manual-fixed-income";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaBonus
  extends Bonus
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();

  fromManualFixedIncome(manualFixedIncome: MetaManualFixedIncome): number {
    return manualFixedIncome.bonus;
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.getOrDefault("PERFORM BONUS", 0);
  }
}
