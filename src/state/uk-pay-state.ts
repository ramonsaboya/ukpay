import { Map as ImmutableMap } from "immutable";
import MetaAdjustedIncome from "src/company/meta/meta-adjusted-income";
import MetaNetIncome from "src/company/meta/meta-net-income";
import MetaBenefitsInKind from "src/company/meta/meta-benefits-in-kind";
import MetaBonus from "src/company/meta/meta-bonus";
import MetaIncomeTax from "src/company/meta/meta-income-tax";
import MetaNationalInsurance from "src/company/meta/meta-national-insurance";
import MetaNetPay from "src/company/meta/meta-net-pay";
import MetaNetPayWithRSU from "src/company/meta/meta-net-pay-with-rsu";
import MetaPensionEmployeeAmount from "src/company/meta/meta-pension-employee-amount";
import MetaPensionEmployeePercentage from "src/company/meta/meta-pension-employee-percentage";
import MetaPensionEmployerAmount from "src/company/meta/meta-pension-employer-amount";
import MetaPensionEmployerPercentage from "src/company/meta/meta-pension-employer-percentage";
import MetaPensionTotalAmount from "src/company/meta/meta-pension-total-amount";
import MetaPensionTotalPercentage from "src/company/meta/meta-pension-total-percentage";
import MetaRSUOverwithheldRefund from "src/company/meta/meta-rsu-overwithheld-refund";
import MetaRSUTaxOffset from "src/company/meta/meta-rsu-tax-offset";
import MetaRSUVest from "src/company/meta/meta-rsu-vest";
import MetaSalary from "src/company/meta/meta-salary";
import MetaTaxableBenefits from "src/company/meta/meta-taxable-benefits";
import MetaTaxablePay from "src/company/meta/meta-taxable-pay";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import IncomeSource from "src/compensation/income/income-source";
import TaxMonth from "src/taxMonth";
import { TaxYear } from "src/hmrc/tax-year-builder";
import taxYear2023_24 from "src/hmrc/tax-year-2023-24";

export type IncomeSourceByMonth = ImmutableMap<TaxMonth, IncomeSource>;
export type CompensationElementByType = ImmutableMap<
  CompensationElementType,
  CompensationElement
>;
export type CalculatedMonthCompensationValuesByElementType = ImmutableMap<
  CompensationElementType,
  number
>;
export type CalculatedCompensationValuesByMonth = ImmutableMap<
  TaxMonth,
  CalculatedMonthCompensationValuesByElementType
>;
export type UKPayState = {
  incomeSources: IncomeSourceByMonth;
  compensationElements: CompensationElementByType;
  compensationElementsTopologicalOrder: ReadonlyArray<CompensationElementType>;
  calculatedCompensationValues: CalculatedCompensationValuesByMonth;
  editingMonth: TaxMonth | null;
  taxYear: TaxYear;
};

type UKPayStateInitializerArgs = {};
export function defaultUKPayState(
  _args: UKPayStateInitializerArgs
): UKPayState {
  const compensationElements = ImmutableMap(
    [
      new MetaSalary(),
      new MetaBonus(),
      new MetaTaxableBenefits(),
      new MetaBenefitsInKind(),
      new MetaPensionEmployeeAmount(),
      new MetaPensionEmployeePercentage(),
      new MetaPensionEmployerAmount(),
      new MetaPensionEmployerPercentage(),
      new MetaPensionTotalAmount(),
      new MetaPensionTotalPercentage(),
      new MetaRSUVest(),
      new MetaRSUTaxOffset(),
      new MetaRSUOverwithheldRefund(),
      new MetaIncomeTax(),
      new MetaNationalInsurance(),
      new MetaTaxablePay(),
      new MetaAdjustedIncome(),
      new MetaNetPay(),
      new MetaNetPayWithRSU(),
      new MetaNetIncome(),
    ].map((element) => [element.type, element])
  );

  return {
    incomeSources: ImmutableMap(),
    compensationElements,
    compensationElementsTopologicalOrder: toposort(compensationElements),
    calculatedCompensationValues: ImmutableMap(),
    editingMonth: null,
    taxYear: taxYear2023_24,
  };
}

function toposort(
  compensationElements: CompensationElementByType
): Array<CompensationElementType> {
  const graph = new Map<
    CompensationElementType,
    Set<CompensationElementType>
  >();
  const indegree = new Map<CompensationElementType, number>();

  compensationElements.valueSeq().forEach((element) => {
    if (!graph.has(element.type)) {
      graph.set(element.type, new Set());
    }
    element.dependencies.forEach((dependency) => {
      if (!graph.has(dependency)) {
        graph.set(dependency, new Set());
      }
      graph.get(dependency)!.add(element.type);
    });
    indegree.set(element.type, element.dependencies.size);
  });

  const topoorder = [];

  const stack: CompensationElementType[] = [];
  graph.forEach((_, elementType) => {
    if (indegree.get(elementType) === 0) {
      stack.push(elementType);
    }
  });

  while (stack.length > 0) {
    const element = stack.pop()!;
    topoorder.push(element);

    graph.get(element)!.forEach((dependency) => {
      indegree.set(dependency, indegree.get(dependency)! - 1);
      if (indegree.get(dependency) === 0) {
        stack.push(dependency);
      }
    });
  }

  if (Array.from(indegree.values()).some((val) => val > 0)) {
    throw new Error("Circular dependency in compensation elements");
  }

  return topoorder;
}
