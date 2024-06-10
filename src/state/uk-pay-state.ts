import { List, Map } from "immutable";
import MetaBenefitsInKind from "src/company/meta/meta-benefits-in-kind";
import MetaBonus from "src/company/meta/meta-bonus";
import MetaIncomeTax from "src/company/meta/meta-income-tax";
import MetaNationalInsurance from "src/company/meta/meta-national-insurance";
import MetaPensionEmployeeAmount from "src/company/meta/meta-pension-employee-amount";
import MetaPensionEmployeePercentage from "src/company/meta/meta-pension-employee-percentage";
import MetaPensionEmployerAmount from "src/company/meta/meta-pension-employer-amount";
import MetaPensionEmployerPercentage from "src/company/meta/meta-pension-employer-percentage";
import MetaRSUOverwithheldRefund from "src/company/meta/meta-rsu-overwithheld-refund";
import MetaRSUTaxOffset from "src/company/meta/meta-rsu-tax-offset";
import MetaRSUVest from "src/company/meta/meta-rsu-vest";
import MetaSalary from "src/company/meta/meta-salary";
import MetaTaxableBenefits from "src/company/meta/meta-taxable-benefits";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import IncomeSource from "src/compensation/income/income-source";
import TaxMonth from "src/taxMonth";

export type IncomeSourcesByMonth = Map<TaxMonth, List<IncomeSource>>;
export type CompensationElements = List<CompensationElement<any>>;
export type CalculatedMonthCompensationValuesByElementType = Map<
  CompensationElementType,
  any
>;
export type CalculatedCompensationValuesByMonth = Map<
  TaxMonth,
  CalculatedMonthCompensationValuesByElementType
>;
export type UKPayState = {
  incomeSources: IncomeSourcesByMonth;
  compensationElements: CompensationElements;
  calculatedCompensationValues: CalculatedCompensationValuesByMonth;
};

type UKPayStateInitializerArgs = {};
export function defaultUKPayState(
  _args: UKPayStateInitializerArgs
): UKPayState {
  return {
    incomeSources: Map(),
    compensationElements: List([
      new MetaSalary(),
      new MetaBonus(),
      new MetaTaxableBenefits(),
      new MetaBenefitsInKind(),
      new MetaPensionEmployeeAmount(),
      new MetaPensionEmployeePercentage(),
      new MetaPensionEmployerAmount(),
      new MetaPensionEmployerPercentage(),
      new MetaRSUVest(),
      new MetaRSUTaxOffset(),
      new MetaRSUOverwithheldRefund(),
      new MetaIncomeTax(),
      new MetaNationalInsurance(),
    ]),
    calculatedCompensationValues: Map(),
  };
}
