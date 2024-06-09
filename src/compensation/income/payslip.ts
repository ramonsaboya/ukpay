import { IncomeSourceType } from "./incomeSource";
import IncomeSourceFixed from "./incomeSourceFixed";

export interface FromPayslip<T> {
  fromPayslip(payslip: Payslip): T;
}

export default class Payslip extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.PAYSLIP;
  public readonly order = 0;
}
