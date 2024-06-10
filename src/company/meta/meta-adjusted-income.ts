import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import AdjustedIncome from "src/compensation/element/adjusted-income";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaAdjustedIncome
  extends AdjustedIncome
  implements IVirtualElement<number>
{
  dependencies = new Set([
    CompensationElementType.TAXABLE_PAY,
    CompensationElementType.PENSION_TOTAL_AMOUNT,
  ]);

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const taxablePay = currentMonthValues.get(
      CompensationElementType.TAXABLE_PAY
    )!;
    const pensionTotalAmount = currentMonthValues.get(
      CompensationElementType.PENSION_TOTAL_AMOUNT
    )!;

    return taxablePay + pensionTotalAmount;
  }
}
