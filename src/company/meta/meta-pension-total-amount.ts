import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import PensionTotalAmount from "src/compensation/element/pension-total-amount";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaPensionTotalAmount
  extends PensionTotalAmount
  implements IVirtualElement
{
  dependencies = new Set([
    CompensationElementType.PENSION_EMPLOYEE_AMOUNT,
    CompensationElementType.PENSION_EMPLOYER_AMOUNT,
  ]);

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const pensionEmployeeAmount = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYEE_AMOUNT
    )!;
    const pensionEmployerAmount = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYER_AMOUNT
    )!;

    return pensionEmployeeAmount + pensionEmployerAmount;
  }
}
