import TaxableBenefits from "src/compensation/element/taxableBenefits";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "src/compensation/income/manualFixedIncome";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaTaxableBenefits
  extends TaxableBenefits
  implements IPayslip<number>, IManualFixedIncome<number>
{
  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): number {
    throw new Error("Method not implemented.");
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.sum("WELLNESS", "TRANSPORTATION");
  }
}
