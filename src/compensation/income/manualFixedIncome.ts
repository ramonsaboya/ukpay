import { IncomeSourceType } from "./incomeSource";
import IncomeSourceFixed from "./incomeSourceFixed";

export interface FromManualFixedIncome<T> {
  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): T;
}

export default class ManualFixedIncome extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.MANUAL_FIXED;
  public readonly order = 1;
}
