import IncomeSource from "../compensation/income/incomeSource";

export type UKPayAction = {
  type: "REGISTER_INCOME_SOURCE";
  incomeSource: IncomeSource;
};
