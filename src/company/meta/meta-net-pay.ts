import { CompensationElementType } from "src/compensation/element/compensation-element";
import NetPay from "src/compensation/element/net-pay";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaNetPay extends NetPay implements IPayslip {
  dependencies = new Set([
    CompensationElementType.TAXABLE_PAY,
    CompensationElementType.PENSION_TOTAL_AMOUNT,
  ]);

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.all() - payslip.deductions.all();
  }
}
