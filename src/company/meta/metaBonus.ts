import Bonus from "src/compensation/element/bonus";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "src/compensation/income/manualFixedIncome";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaBonus
  extends Bonus
  implements IPayslip<number>, IManualFixedIncome<number>
{
  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): number {
    throw new Error("Method not implemented.");
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.getOrDefault("PERFORM BONUS", 0);
  }
}
