import IncomeSource, {
  IncomeSourceType,
} from "src/compensation/income/incomeSource";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "src/compensation/income/manualFixedIncome";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import {
  CalculatedMonthCompensationValuesByElementType,
  CalculatedCompensationValuesByMonth,
} from "src/state/ukPayState";
import TaxMonth from "src/taxMonth";

export enum CompensationElementType {
  SALARY,
  BONUS,
}

export default abstract class CompensationElement<T> {
  public abstract readonly type: CompensationElementType;
  public abstract readonly dependencies: Set<CompensationElementType>;

  public abstract readonly rowLabel: string;
  public abstract readonly formatter: (value: T) => string;
  public abstract readonly aggregate: (values: T[]) => T;

  public calculate(
    taxMonth: TaxMonth,
    incomeSources: Array<IncomeSource>,
    currentMonthValues: CalculatedMonthCompensationValuesByElementType,
    previousMonthsValues: CalculatedCompensationValuesByMonth
  ): T {
    for (const incomeSource of incomeSources) {
      if (this.isPayslip(incomeSource)) {
        return this.fromPayslip(
          incomeSource as Payslip,
          taxMonth,
          currentMonthValues,
          previousMonthsValues
        );
      }
      if (this.isManualFixedIncome(incomeSource)) {
        return this.fromManualFixedIncome(incomeSource as ManualFixedIncome);
      }
    }

    throw new Error("Not implemented");
  }

  private isPayslip(incomeSource: IncomeSource): this is IPayslip<T> {
    return (
      incomeSource.type === IncomeSourceType.PAYSLIP && "fromPayslip" in this
    );
  }

  private isManualFixedIncome(
    incomeSource: IncomeSource
  ): this is IManualFixedIncome<T> {
    return (
      incomeSource.type === IncomeSourceType.MANUAL_FIXED &&
      "fromManualFixedIncome" in this
    );
  }
}
