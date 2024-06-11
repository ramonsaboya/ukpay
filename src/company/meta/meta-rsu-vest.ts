import { CompensationElementType } from "src/compensation/element/compensation-element";
import RSUVest from "src/compensation/element/rsu-vest";
import { IManualFixedIncome } from "src/compensation/income/manual-fixed-income";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaRSUVest
  extends RSUVest
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();
  allowManualEntry = true;

  fromManualFixedIncome(manualFixedIncome: MetaManualFixedIncome): number {
    return manualFixedIncome.rsuVest;
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.grossBenefits.getOrDefault("RSUS", 0);
  }
}
