import { List } from "immutable";
import { TaxPeriod } from "../taxPeriod";

export type PayslipItem = {
  name: string;
  amount: number;
};

export abstract class Payslip {
  protected _file: File;

  constructor(file: File) {
    this._file = file;
  }

  public abstract process(): Promise<void>;

  protected _period!: TaxPeriod;
  get period() {
    return this._period;
  }

  protected _taxCode!: string;
  get taxCode() {
    return this._taxCode;
  }

  protected _earnings!: List<PayslipItem>;
  get earnings() {
    return this._earnings;
  }

  protected _grossBenefits!: List<PayslipItem>;
  get grossBenefits() {
    return this._grossBenefits;
  }
}
