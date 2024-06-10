import { List, Map as ImmutableMap } from "immutable";
import { TAX_MONTHS } from "../taxMonth";
import { CompensationElementType } from "./element/compensationElement";
import IncomeSource from "./income/incomeSource";
import {
  CalculatedCompensationValuesByMonth,
  CalculatedMonthCompensationValuesByElementType,
  CompensationElements,
  IncomeSourcesByMonth,
} from "../state/ukPayState";

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
    graph.set(element.type, element.dependencies);
  });
  graph.forEach((dependencies) => {
    dependencies.forEach((dependency) => {
      indegree.set(dependency, (indegree.get(dependency) ?? 0) + 1);
    });
  });

  const topoorder = [];

  const stack: CompensationElementType[] = [];
  graph.forEach((_, elementType) => {
    if ((indegree.get(elementType) ?? 0) === 0) {
      stack.push(elementType);
    }
  });

  while (stack.length > 0) {
    const element = stack.pop()!;
    topoorder.push(element);

    graph.get(element)!.forEach((dependency) => {
      indegree.set(dependency, indegree.get(dependency)! - 1);
      if (indegree.get(dependency) === 0) {
        indegree.delete(dependency);
        stack.push(dependency);
      }
    });
  }

  if (indegree.size > 0) {
    throw new Error("Circular dependency in compensation elements");
  }

  return topoorder;
}
