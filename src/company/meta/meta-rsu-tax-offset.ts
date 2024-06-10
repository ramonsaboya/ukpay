import { CompensationElementType } from "src/compensation/element/compensation-element";
import RSUTaxOffset from "src/compensation/element/rsu-tax-offset";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaRSUTaxOffset
  extends RSUTaxOffset
  implements IPayslip<number>
{
  dependencies = new Set<CompensationElementType>();

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.getOrDefault("RSU TAX OFFSET", 0);
  }
}
