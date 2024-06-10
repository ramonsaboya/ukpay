import { List, Map } from "immutable";
import MetaBonus from "src/company/meta/metaBonus";
import MetaSalary from "src/company/meta/metaSalary";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensationElement";
import IncomeSource from "src/compensation/income/incomeSource";
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
    compensationElements: List([new MetaSalary(), new MetaBonus()]),
    calculatedCompensationValues: Map(),
  };
}
