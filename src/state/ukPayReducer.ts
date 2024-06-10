import { List } from "immutable";
import { UKPayAction } from "./ukPayAction";
import { UKPayState } from "./ukPayState";
import IncomeSource, {
  IncomeSourceType,
} from "../compensation/income/incomeSource";
import resolveCompensation from "../compensation/compensationResolver";
import Payslip from "../compensation/income/payslip/payslip";

export function ukPayReducer(
  state: UKPayState,
  action: UKPayAction
): UKPayState {
  switch (action.type) {
    case "REGISTER_INCOME_SOURCE":
      const incomeSource = action.incomeSource;
      const taxMonth = incomeSource.taxMonth;

      const currentMonthIncomeSources =
        state.incomeSources.get(taxMonth) ?? List();

      if (
        !allowNewIncomeSource(currentMonthIncomeSources.toArray(), incomeSource)
      ) {
        throw new Error("Cannot add income source of this type");
      }

      const newMonthIncomeSources = currentMonthIncomeSources
        .push(incomeSource)
        .sort((a, b) => a.order - b.order);
      const newIncomeSources = state.incomeSources.set(
        taxMonth,
        newMonthIncomeSources
      );

      const calculatedCompensationValues = resolveCompensation(
        newIncomeSources,
        state.compensationElements
      );

      return {
        ...state,
        incomeSources: newIncomeSources,
        calculatedCompensationValues,
      };
  }
}

// TODO Manual sources should allow for multiple sources per month
function allowNewIncomeSource(
  existingSources: IncomeSource[],
  newIncomeSource: IncomeSource
): boolean {
  if (newIncomeSource instanceof Payslip) {
    return !existingSources.some((source) => source instanceof Payslip);
  } else if (newIncomeSource.type === IncomeSourceType.SCHWAB_REPORT) {
    return !existingSources.some(
      (source) => source.type === IncomeSourceType.SCHWAB_REPORT
    );
  } else if (newIncomeSource.type === IncomeSourceType.MANUAL_FIXED) {
    return !existingSources.some(
      (source) => source.type === IncomeSourceType.MANUAL_FIXED
    );
  } else if (newIncomeSource.type === IncomeSourceType.MANUAL_PREDICTED) {
    return !existingSources.some(
      (source) => source.type === IncomeSourceType.MANUAL_PREDICTED
    );
  } else if (newIncomeSource.type === IncomeSourceType.COMPANY_META) {
    return !existingSources.some(
      (source) => source.type === IncomeSourceType.COMPANY_META
    );
  }
  throw new Error("Unknown income source type");
}
