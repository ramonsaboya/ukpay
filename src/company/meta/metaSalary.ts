import Salary from "../../compensation/element/salary";
import ManualFixedIncome, {
  FromManualFixedIncome,
} from "../../compensation/income/manualFixedIncome";
import Payslip, { FromPayslip } from "../../compensation/income/payslip";

export default class MetaSalary
  extends Salary
  implements FromPayslip<number>, FromManualFixedIncome<number>
{
  fromManualFixedIncome(manualFixedIncome: ManualFixedIncome): number {
    throw new Error("Method not implemented.");
  }
  fromPayslip(payslip: Payslip): number {
    throw new Error("Method not implemented.");
  }
}
