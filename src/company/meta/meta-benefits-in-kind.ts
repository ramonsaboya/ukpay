import BenefitsInKind from "src/compensation/element/benefits-in-kind";
import { CompensationElementType } from "src/compensation/element/compensation-element";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "src/compensation/income/manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaBenefitsInKind
  extends BenefitsInKind
  implements IPayslip<number>, IManualFixedIncome<number>
{
  dependencies = new Set<CompensationElementType>();

  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): number {
    throw new Error("Method not implemented.");
  }

  fromPayslip(payslip: Payslip): number {
    return (
      payslip.grossBenefits.all() -
      payslip.grossBenefits.getOrDefault("RSUS", 0)
    );
  }
}
