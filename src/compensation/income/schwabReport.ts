import { IncomeSourceType } from "./incomeSource";
import IncomeSourceFixed from "./incomeSourceFixed";

export default class SchwabReport extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.SCHWAB_REPORT;
  public readonly order = 0;
}
