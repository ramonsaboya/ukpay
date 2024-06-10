import { IncomeSourceType } from "src/compensation/income/income-source";
import IncomeSourceFixed from "src/compensation/income/income-source-fixed";

export interface IManualFixedIncome<T> {
  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): T;
}

export default class ManualFixedIncome extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.MANUAL_FIXED;
  public readonly order = 1;
}
