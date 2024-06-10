import BenefitsInKind from "src/compensation/element/benefitsInKind";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "src/compensation/income/manualFixedIncome";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaBenefitsInKind
  extends BenefitsInKind
  implements IPayslip<number>, IManualFixedIncome<number>
{
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
