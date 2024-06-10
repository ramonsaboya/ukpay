import { CompensationElementType } from "src/compensation/element/compensation-element";
import CompanyModelIncome from "src/compensation/income/company-model-income";
import { IncomeSourceType } from "src/compensation/income/income-source";

export default class MetaPredictedIncome extends CompanyModelIncome {
  public readonly type = IncomeSourceType.COMPANY_META;
  dependencies = new Set<CompensationElementType>();
}
