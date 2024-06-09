import CompanyModelIncome from "./companyModelIncome";
import { IncomeSourceType } from "./incomeSource";

export default class MetaPredictedIncome extends CompanyModelIncome {
  public readonly type = IncomeSourceType.COMPANY_META;
}
