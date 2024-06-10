import { IncomeSourceType } from "src/compensation/income/income-source";
import IncomeSourcePredicted from "src/compensation/income/income-source-predicted";

export default class ManualPredictedIncome extends IncomeSourcePredicted {
  public readonly type = IncomeSourceType.MANUAL_PREDICTED;
  public readonly order = 2;
}
