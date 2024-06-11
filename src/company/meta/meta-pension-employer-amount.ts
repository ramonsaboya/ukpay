import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import PensionEmployerAmount from "src/compensation/element/pension-employer-amount";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaPensionEmployerAmount
  extends PensionEmployerAmount
  implements IVirtualElement
{
  dependencies = new Set([
    CompensationElementType.SALARY,
    CompensationElementType.PENSION_EMPLOYER_PERCENTAGE,
  ]);

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const salary = currentMonthValues.get(CompensationElementType.SALARY)!;
    const pensionEmployerPercentage = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYER_PERCENTAGE
    )!;
    return salary * pensionEmployerPercentage;
  }
}
