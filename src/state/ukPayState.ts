import { List, Map } from "immutable";
import IncomeSource from "../compensation/income/incomeSource";
import TaxMonth from "../taxMonth";
import CompensationElement, {
  CompensationElementType,
} from "../compensation/element/compensationElement";
import MetaSalary from "../company/meta/metaSalary";

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
    compensationElements: List([new MetaSalary()]),
    calculatedCompensationValues: Map(),
  };
}
