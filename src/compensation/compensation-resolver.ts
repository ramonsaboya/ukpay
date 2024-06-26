import { Map as ImmutableMap } from "immutable";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import { TaxYear } from "src/hmrc/tax-year";
import {
  IncomeSourceByMonth,
  CalculatedCompensationValuesByMonth,
  CalculatedMonthCompensationValuesByElementType,
  CompensationElementByType,
} from "src/state/uk-pay-state";
import { TAX_MONTHS } from "src/hmrc/tax-month";

export default function resolveCompensation(
  incomeSources: IncomeSourceByMonth,
  compensationElements: CompensationElementByType,
  compensationElementsTopologicalOrder: ReadonlyArray<CompensationElementType>,
  taxYear: TaxYear
): CalculatedCompensationValuesByMonth {
  let calculatedValues: CalculatedCompensationValuesByMonth = ImmutableMap();

  TAX_MONTHS.forEach((taxMonth) => {
    const incomeSource = incomeSources.get(taxMonth) ?? null;

    let currentMonthValues: CalculatedMonthCompensationValuesByElementType =
      ImmutableMap();

    compensationElementsTopologicalOrder.forEach((elementType) => {
      const element = compensationElements.get(elementType)!;

      if (incomeSource == null) {
        currentMonthValues = currentMonthValues.set(element.type, 0);
      } else {
        const value = element.calculate(
          taxMonth,
          incomeSource,
          currentMonthValues,
          calculatedValues,
          taxYear
        );

        currentMonthValues = currentMonthValues.set(element.type, value);
      }
    });

    calculatedValues = calculatedValues.set(taxMonth, currentMonthValues);
  });

  return calculatedValues;
}
