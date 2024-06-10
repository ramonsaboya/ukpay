import { List, Map as ImmutableMap } from "immutable";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import IncomeSource from "src/compensation/income/income-source";
import {
  IncomeSourcesByMonth,
  CompensationElements,
  CalculatedCompensationValuesByMonth,
  CalculatedMonthCompensationValuesByElementType,
} from "src/state/uk-pay-state";
import { TAX_MONTHS } from "src/taxMonth";

export default function resolveCompensation(
  incomeSources: IncomeSourcesByMonth,
  compensationElements: CompensationElements
): CalculatedCompensationValuesByMonth {
  const resolveOrder = toposort(compensationElements);
  const sortedCompensationElements = resolveOrder.map(
    (elementType) =>
      compensationElements.find((element) => element.type === elementType)!
  );

  let calculatedValues: CalculatedCompensationValuesByMonth = ImmutableMap();

  TAX_MONTHS.forEach((taxMonth) => {
    const incomeSourcesForMonth: IncomeSource[] =
      incomeSources.get(taxMonth, List() as List<IncomeSource>).toArray() ?? [];

    let currentMonthValues: CalculatedMonthCompensationValuesByElementType =
      ImmutableMap();

    sortedCompensationElements.forEach((element) => {
      if (incomeSourcesForMonth.length === 0) {
        currentMonthValues = currentMonthValues.set(element.type, 0);
      } else {
        const value = element.calculate(
          taxMonth,
          incomeSourcesForMonth,
          currentMonthValues,
          calculatedValues
        );

        currentMonthValues = currentMonthValues.set(element.type, value);
      }
    });

    calculatedValues = calculatedValues.set(taxMonth, currentMonthValues);
  });

  return calculatedValues;
}

function toposort(
  compensationElements: CompensationElements
): Array<CompensationElementType> {
  const graph = new Map<
    CompensationElementType,
    Set<CompensationElementType>
  >();
  const indegree = new Map<CompensationElementType, number>();

  compensationElements.toArray().forEach((element) => {
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
