import { List } from "immutable";
import resolveCompensation from "src/compensation/compensation-resolver";
import IncomeSource, {
  IncomeSourceType,
} from "src/compensation/income/income-source";
import Payslip from "src/compensation/income/payslip/payslip";
import { UKPayAction } from "src/state/uk-pay-action";
import { UKPayState } from "src/state/uk-pay-state";

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

      // TODO maybe should replace instead of blocking
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
    case "SET_EDITING_MONTH":
      return {
        ...state,
        editingMonth: action.month,
      };
    case "SAVE_MONTH": {
      const incomeSource = action.manualFixedIncome;
      const taxMonth = incomeSource.taxMonth;

      const currentMonthIncomeSources =
        state.incomeSources.get(taxMonth) ?? List();

      // TODO maybe should replace instead of blocking
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
        editingMonth: null,
      };
    }
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