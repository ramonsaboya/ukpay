import { CompensationElementType } from "src/compensation/element/compensation-element";
import PensionEmployeePercentage from "src/compensation/element/pension-employee-percentage";
import { IManualFixedIncome } from "src/compensation/income/manual-fixed-income";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaPensionEmployeePercentage
  extends PensionEmployeePercentage
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set([CompensationElementType.SALARY]);

  fromManualFixedIncome(manualFixedIncome: MetaManualFixedIncome): number {
    return manualFixedIncome.pensionEmployeePercentage / 100;
  }

  fromPayslip(
    payslip: Payslip,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const salary = currentMonthValues.get(CompensationElementType.SALARY)!;
    const pensionEmployeeAmount = payslip.earnings.get("AE PENSION EE")! * -1;

    return pensionEmployeeAmount / salary;
  }
}
