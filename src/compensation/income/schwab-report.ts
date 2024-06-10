import { IncomeSourceType } from "src/compensation/income/income-source";
import IncomeSourceFixed from "src/compensation/income/income-source-fixed";

export default class SchwabReport extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.SCHWAB_REPORT;
  public readonly order = 0;
}
