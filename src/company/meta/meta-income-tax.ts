import { CompensationElementType } from "src/compensation/element/compensation-element";
import IncomeTax from "src/compensation/element/income-tax";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaIncomeTax
  extends IncomeTax
  implements IPayslip<number>
{
  dependencies = new Set<CompensationElementType>();

  fromPayslip(payslip: Payslip): number {
    return payslip.deductions.getOrDefault("TAX PAID", 0);
  }
}
