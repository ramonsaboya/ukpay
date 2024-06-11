import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import PensionEmployeeAmount from "src/compensation/element/pension-employee-amount";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaPensionEmployeeAmount
  extends PensionEmployeeAmount
  implements IVirtualElement
{
  dependencies = new Set([
    CompensationElementType.SALARY,
    CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE,
  ]);

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const salary = currentMonthValues.get(CompensationElementType.SALARY)!;
    const pensionEmployeePercentage = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE
    )!;

    return salary * pensionEmployeePercentage;
  }
}
