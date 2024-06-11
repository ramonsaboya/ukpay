import BenefitsInKind from "src/compensation/element/benefits-in-kind";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import { IManualFixedIncome } from "src/compensation/income/manual-fixed-income";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaBenefitsInKind
  extends BenefitsInKind
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();

  fromManualFixedIncome(manualFixedIncome: MetaManualFixedIncome): number {
    return manualFixedIncome.benefitsInKind;
  }

  fromPayslip(payslip: Payslip): number {
    return (
      payslip.grossBenefits.all() -
      payslip.grossBenefits.getOrDefault("RSUS", 0)
    );
  }
}
