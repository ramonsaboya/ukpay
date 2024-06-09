import { IncomeSourceType } from "./incomeSource";
import IncomeSourcePredicted from "./incomeSourcePredicted";

export default class ManualPredictedIncome extends IncomeSourcePredicted {
  public readonly type = IncomeSourceType.MANUAL_PREDICTED;
  public readonly order = 2;
}
