import IncomeSource, {
  IncomeSourceType,
} from "src/compensation/income/income-source";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "src/compensation/income/manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import { TaxYear } from "src/hmrc/tax-year";
import {
  CalculatedMonthCompensationValuesByElementType,
  CalculatedCompensationValuesByMonth,
} from "src/state/uk-pay-state";
import TaxMonth from "src/hmrc/tax-month";

export enum CompensationElementType {
  SALARY,
  BONUS,
  TAXABLE_BENEFITS,
  BENEFITS_IN_KIND,
  PENSION_EMPLOYEE_AMOUNT,
  PENSION_EMPLOYEE_PERCENTAGE,
  PENSION_EMPLOYER_AMOUNT,
  PENSION_EMPLOYER_PERCENTAGE,
  PENSION_TOTAL_AMOUNT,
  PENSION_TOTAL_PERCENTAGE,
  RSU_VEST,
  RSU_TAX_OFFSET,
  RSU_OVERWITHHELD_REFUND,
  INCOME_TAX,
  NATIONAL_INSURANCE,
  TAXABLE_PAY,
  ADJUSTED_INCOME,
  NET_PAY,
  NET_PAY_WITH_RSU,
  NET_INCOME,
}

export interface IVirtualElement {
  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType,
    taxMonth: TaxMonth,
    taxYear: TaxYear,
    previousMonthsValues: CalculatedCompensationValuesByMonth
  ): number;
}

export type Formatter = {
  display: (value: number) => string;
  editAddOn: string;
};

export default abstract class CompensationElement {
  public abstract readonly type: CompensationElementType;
  public abstract readonly dependencies: Set<CompensationElementType>;

  public abstract readonly rowLabel: string;
  public abstract readonly formatter: Formatter;
  public abstract readonly aggregate: ((values: number[]) => number) | null;

  public calculate(
    taxMonth: TaxMonth,
    incomeSource: IncomeSource,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType,
    previousMonthsValues: CalculatedCompensationValuesByMonth,
    taxYear: TaxYear
  ): number {
    if (this.isPayslip(incomeSource)) {
      return this.fromPayslip(incomeSource as Payslip, currentMonthValues);
    }

    if (this.isManualFixedIncome(incomeSource)) {
      return this.fromManualFixedIncome(incomeSource as ManualFixedIncome);
    }

    if (this.isVirtualElement()) {
      return this.fromState(
        currentMonthValues,
        taxMonth,
        taxYear,
        previousMonthsValues
      );
    }

    return 0;
  }

  private isPayslip(incomeSource: IncomeSource): this is IPayslip {
    return (
      incomeSource.type === IncomeSourceType.PAYSLIP && "fromPayslip" in this
    );
  }

  public isManualFixedIncome(
    incomeSource?: IncomeSource
  ): this is IManualFixedIncome {
    return (
      (incomeSource === undefined ||
        incomeSource.type === IncomeSourceType.MANUAL_FIXED) &&
      "fromManualFixedIncome" in this
    );
  }

  private isVirtualElement(): this is IVirtualElement {
    return "fromState" in this;
  }
}
