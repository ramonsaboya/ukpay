import { CompensationElementType } from "src/compensation/element/compensation-element";
import PensionEmployerAmount from "src/compensation/element/pension-employer-amount";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaPensionEmployerAmount
  extends PensionEmployerAmount
  implements IPayslip<number>
{
  dependencies = new Set([
    CompensationElementType.PENSION_EMPLOYER_PERCENTAGE,
    CompensationElementType.SALARY,
  ]);

  fromPayslip(
    _payslip: Payslip,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const salary = currentMonthValues.get(CompensationElementType.SALARY)!;
    const pensionEmployerPercentage = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYER_PERCENTAGE
    )!;
    return salary * pensionEmployerPercentage;
  }
}
