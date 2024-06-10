import {
  CalculatedCompensationValuesByMonth,
  CalculatedMonthCompensationValuesByElementType,
} from "../../state/ukPayState";
import TaxMonth from "../../taxMonth";
import IncomeSource, { IncomeSourceType } from "../income/incomeSource";
import ManualFixedIncome, {
  IManualFixedIncome,
} from "../income/manualFixedIncome";
import Payslip, { IPayslip } from "../income/payslip/payslip";

export enum CompensationElementType {
  SALARY,
}

export default abstract class CompensationElement<T> {
  public abstract readonly type: CompensationElementType;
  public abstract readonly dependencies: Set<CompensationElementType>;

  public abstract readonly rowLabel: string;

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
