import CompanyModelIncome from "../../compensation/income/companyModelIncome";
import { IncomeSourceType } from "../../compensation/income/incomeSource";

export default class MetaPredictedIncome extends CompanyModelIncome {
  public readonly type = IncomeSourceType.COMPANY_META;
}
