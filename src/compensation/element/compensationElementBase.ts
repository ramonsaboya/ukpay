import IncomeSource, { IncomeSourceType } from "../income/incomeSource";
import ManualFixedIncome, {
  FromManualFixedIncome,
} from "../income/manualFixedIncome";
import Payslip, { FromPayslip } from "../income/payslip";

export enum CompensationElementType {
  SALARY,
}

export default abstract class CompensationElementBase<T> {
  public abstract readonly type: CompensationElementType;

  public calculate(incomeSources: Array<IncomeSource>): T {
    for (const incomeSource of incomeSources) {
      if (this.isFromPayslip(incomeSource)) {
        return this.fromPayslip(incomeSource as Payslip);
      }
      if (this.isFromManualFixedIncome(incomeSource)) {
        return this.fromManualFixedIncome(incomeSource as ManualFixedIncome);
      }
    }

    throw new Error("Not implemented");
  }

  private isFromPayslip(incomeSource: IncomeSource): this is FromPayslip<T> {
    return (
      incomeSource.type === IncomeSourceType.PAYSLIP && "fromPayslip" in this
    );
  }

  private isFromManualFixedIncome(
    incomeSource: IncomeSource
  ): this is FromManualFixedIncome<T> {
    return (
      incomeSource.type === IncomeSourceType.MANUAL_FIXED &&
      "fromManualFixedIncome" in this
    );
  }
}
