import { IncomeSourceType } from "src/compensation/income/incomeSource";
import IncomeSourcePredicted from "src/compensation/income/incomeSourcePredicted";

export default class ManualPredictedIncome extends IncomeSourcePredicted {
  public readonly type = IncomeSourceType.MANUAL_PREDICTED;
  public readonly order = 2;
}
