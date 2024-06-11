import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import PensionTotalPercentage from "src/compensation/element/pension-total-percentage";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaPensionTotalPercentage
  extends PensionTotalPercentage
  implements IVirtualElement
{
  dependencies = new Set([
    CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE,
    CompensationElementType.PENSION_EMPLOYER_PERCENTAGE,
  ]);

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const pensionEmployeePercentage = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE
    )!;
    const pensionEmployerPercentage = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYER_PERCENTAGE
    )!;

    return pensionEmployerPercentage + pensionEmployeePercentage;
  }
}
