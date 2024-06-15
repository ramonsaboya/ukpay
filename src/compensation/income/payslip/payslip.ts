import { IncomeSourceType } from "src/compensation/income/income-source";
import IncomeSourceFixed from "src/compensation/income/income-source-fixed";
import PayslipItemList from "src/compensation/income/payslip/paylist-item-list";
import { TaxYear } from "src/hmrc/tax-year";
import {
  CalculatedMonthCompensationValuesByElementType,
  CalculatedCompensationValuesByMonth,
} from "src/state/uk-pay-state";
import TaxMonth from "src/hmrc/tax-month";

export interface IPayslip {
  fromPayslip(
    payslip: Payslip,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType,
    taxMonth: TaxMonth,
    previousMonthsValues: CalculatedCompensationValuesByMonth,
    taxYear: TaxYear
  ): number;
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
