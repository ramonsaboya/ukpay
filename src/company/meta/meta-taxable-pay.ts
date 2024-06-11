import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import TaxablePay from "src/compensation/element/taxable-pay";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaTaxablePay
  extends TaxablePay
  implements IVirtualElement
{
  dependencies = new Set([
    CompensationElementType.SALARY,
    CompensationElementType.BONUS,
    CompensationElementType.TAXABLE_BENEFITS,
    CompensationElementType.RSU_VEST,
    CompensationElementType.PENSION_EMPLOYEE_AMOUNT,
    CompensationElementType.BENEFITS_IN_KIND,
  ]);

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const salary = currentMonthValues.get(CompensationElementType.SALARY)!;
    const bonus = currentMonthValues.get(CompensationElementType.BONUS)!;
    const taxableBenefits = currentMonthValues.get(
      CompensationElementType.TAXABLE_BENEFITS
    )!;
    const rsuVest = currentMonthValues.get(CompensationElementType.RSU_VEST)!;
    const pensionEmployeeAmount = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYEE_AMOUNT
    )!;
    const benefitsInKind = currentMonthValues.get(
      CompensationElementType.BENEFITS_IN_KIND
    )!;

    return (
      salary +
      bonus +
      taxableBenefits +
      benefitsInKind +
      rsuVest -
      pensionEmployeeAmount
    );
  }
}
