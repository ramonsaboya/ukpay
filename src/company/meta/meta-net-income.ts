import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import NetIncome from "src/compensation/element/net-income";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaNetIncome
  extends NetIncome
  implements IVirtualElement
{
  dependencies = new Set([
    CompensationElementType.TAXABLE_PAY,
    CompensationElementType.INCOME_TAX,
    CompensationElementType.NATIONAL_INSURANCE,
  ]);

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const taxablePay = currentMonthValues.get(
      CompensationElementType.TAXABLE_PAY
    )!;
    const incomeTax = currentMonthValues.get(
      CompensationElementType.INCOME_TAX
    )!;
    const nationalInsurance = currentMonthValues.get(
      CompensationElementType.NATIONAL_INSURANCE
    )!;

    return taxablePay - incomeTax - nationalInsurance;
  }
}
