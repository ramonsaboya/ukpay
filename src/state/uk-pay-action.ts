import IncomeSource from "src/compensation/income/income-source";
import ManualFixedIncome from "src/compensation/income/manual-fixed-income";
import TaxMonth from "src/taxMonth";

export type UKPayAction =
  | {
      type: "REGISTER_INCOME_SOURCE";
      incomeSource: IncomeSource;
    }
  | {
      type: "SET_EDITING_MONTH";
      month: TaxMonth;
    }
  | {
      type: "SAVE_MONTH";
      manualFixedIncome: ManualFixedIncome;
    };
