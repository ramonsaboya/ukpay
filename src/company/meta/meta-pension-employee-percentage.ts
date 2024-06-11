import { CompensationElementType } from "src/compensation/element/compensation-element";
import PensionEmployeePercentage from "src/compensation/element/pension-employee-percentage";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaPensionEmployeePercentage
  extends PensionEmployeePercentage
  implements IPayslip
{
  dependencies = new Set([
    CompensationElementType.SALARY,
    CompensationElementType.PENSION_EMPLOYEE_AMOUNT,
  ]);

  fromPayslip(
    _payslip: Payslip,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const salary = currentMonthValues.get(CompensationElementType.SALARY)!;
    const pensionEmployeeAmount = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYEE_AMOUNT
    )!;
    return pensionEmployeeAmount / salary;
  }
}
