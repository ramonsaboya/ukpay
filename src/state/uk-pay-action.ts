import IncomeSource from "src/compensation/income/income-source";

export type UKPayAction = {
  type: "REGISTER_INCOME_SOURCE";
  incomeSource: IncomeSource;
};
