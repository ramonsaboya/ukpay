import { IncomeSourceType } from "src/compensation/income/incomeSource";
import IncomeSourceFixed from "src/compensation/income/incomeSourceFixed";
import PayslipItemList from "src/compensation/income/payslip/paylistItemList";
import {
  CalculatedMonthCompensationValuesByElementType,
  CalculatedCompensationValuesByMonth,
} from "src/state/ukPayState";
import TaxMonth from "src/taxMonth";

export interface IPayslip<T> {
  fromPayslip(
    payslip: Payslip,
    taxMonth: TaxMonth,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType,
    previousMonthsValues: CalculatedCompensationValuesByMonth
  ): T;
}

export default abstract class Payslip extends IncomeSourceFixed {
  public readonly type = IncomeSourceType.PAYSLIP;
  public readonly order = 0;

  protected _taxCode!: string;
  get taxCode() {
    return this._taxCode;
  }

  protected _earnings!: PayslipItemList;
  get earnings() {
    return this._earnings;
  }

  protected _deductions!: PayslipItemList;
  get deductions() {
    return this._deductions;
  }

  protected _grossBenefits!: PayslipItemList;
  get grossBenefits() {
    return this._grossBenefits;
  }
}
