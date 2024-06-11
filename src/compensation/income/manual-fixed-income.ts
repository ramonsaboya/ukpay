import { IncomeSourceType } from "src/compensation/income/income-source";
import IncomeSourceFixed from "src/compensation/income/income-source-fixed";
import {
  CalculatedMonthCompensationValuesByElementType,
  CalculatedCompensationValuesByMonth,
} from "src/state/uk-pay-state";
import TaxMonth from "src/taxMonth";

export interface IManualFixedIncome {
  fromManualFixedIncome(
    manualFixedIncome: ManualFixedIncome,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType,
    taxMonth: TaxMonth,
    previousMonthsValues: CalculatedCompensationValuesByMonth
  ): number;
}

export default abstract class ManualFixedIncome extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.MANUAL_FIXED;
  public readonly order = 1;
}
