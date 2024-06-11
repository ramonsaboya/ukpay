import { CompensationElementType } from "src/compensation/element/compensation-element";
import RSUTaxOffset from "src/compensation/element/rsu-tax-offset";
import { IManualFixedIncome } from "src/compensation/income/manual-fixed-income";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaRSUTaxOffset
  extends RSUTaxOffset
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();
  allowManualEntry = true;

  fromManualFixedIncome(manualFixedIncome: MetaManualFixedIncome): number {
    return manualFixedIncome.rsuTaxOffset;
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.getOrDefault("RSU TAX OFFSET", 0);
  }
}
