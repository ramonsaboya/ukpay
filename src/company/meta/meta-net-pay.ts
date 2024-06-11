import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import NetPay from "src/compensation/element/net-pay";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaNetPay
  extends NetPay
  implements IPayslip, IVirtualElement
{
  dependencies = new Set([
    CompensationElementType.SALARY,
    CompensationElementType.BONUS,
    CompensationElementType.TAXABLE_BENEFITS,
    CompensationElementType.RSU_TAX_OFFSET,
    CompensationElementType.RSU_OVERWITHHELD_REFUND,
    CompensationElementType.PENSION_EMPLOYEE_AMOUNT,
    CompensationElementType.INCOME_TAX,
    CompensationElementType.NATIONAL_INSURANCE,
  ]);

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.all() - payslip.deductions.all();
  }

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const salary = currentMonthValues.get(CompensationElementType.SALARY)!;
    const bonus = currentMonthValues.get(CompensationElementType.BONUS)!;
    const taxableBenefits = currentMonthValues.get(
      CompensationElementType.TAXABLE_BENEFITS
    )!;
    const rsuTaxOffset = currentMonthValues.get(
      CompensationElementType.RSU_TAX_OFFSET
    )!;
    const rsuOverwithheldRefund = currentMonthValues.get(
      CompensationElementType.RSU_OVERWITHHELD_REFUND
    )!;
    const pensionEmployeeAmount = currentMonthValues.get(
      CompensationElementType.PENSION_EMPLOYEE_AMOUNT
    )!;
    const incomeTax = currentMonthValues.get(
      CompensationElementType.INCOME_TAX
    )!;
    const nationalInsurance = currentMonthValues.get(
      CompensationElementType.NATIONAL_INSURANCE
    )!;

    return (
      salary +
      bonus +
      taxableBenefits +
      rsuTaxOffset +
      rsuOverwithheldRefund -
      pensionEmployeeAmount -
      incomeTax -
      nationalInsurance
    );
  }
}
