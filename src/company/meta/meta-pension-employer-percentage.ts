import { CompensationElementType } from "src/compensation/element/compensation-element";
import PensionEmployerPercentage from "src/compensation/element/pension-employer-percentage";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaPensionEmployerPercentage
  extends PensionEmployerPercentage
  implements IPayslip
{
  dependencies = new Set([CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE]);

  fromPayslip(
    _payslip: Payslip,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const pensionEmployeePercentage = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE
    )!;

    return this.getEmployerPensionMatch(pensionEmployeePercentage * 100) / 100;
  }

  private getEmployerPensionMatch(employeePension: number): number {
    switch (employeePension) {
      case 0:
      case 1:
      case 2:
        return 0;
      case 3:
        return 6;
      case 4:
        return 7;
      case 5:
        return 8;
      default:
        return 9;
    }
  }
}
