import CompanyModelIncome from "src/compensation/income/companyModelIncome";
import { IncomeSourceType } from "src/compensation/income/incomeSource";

export default class MetaPredictedIncome extends CompanyModelIncome {
  public readonly type = IncomeSourceType.COMPANY_META;
}
