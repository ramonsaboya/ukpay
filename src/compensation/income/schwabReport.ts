import { IncomeSourceType } from "src/compensation/income/incomeSource";
import IncomeSourceFixed from "src/compensation/income/incomeSourceFixed";

export default class SchwabReport extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.SCHWAB_REPORT;
  public readonly order = 0;
}
