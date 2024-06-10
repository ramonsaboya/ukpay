import { IncomeSourceType } from "src/compensation/income/incomeSource";
import IncomeSourceFixed from "src/compensation/income/incomeSourceFixed";

export interface IManualFixedIncome<T> {
  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): T;
}

export default class ManualFixedIncome extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.MANUAL_FIXED;
  public readonly order = 1;
}
