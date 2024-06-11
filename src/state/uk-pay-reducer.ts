import resolveCompensation from "src/compensation/compensation-resolver";
import IncomeSource from "src/compensation/income/income-source";
import { UKPayAction } from "src/state/uk-pay-action";
import { UKPayState } from "src/state/uk-pay-state";

export function ukPayReducer(
  state: UKPayState,
  action: UKPayAction
): UKPayState {
  switch (action.type) {
    case "REGISTER_INCOME_SOURCE":
      return registerIncomeSource(state, action.incomeSource);
    case "SET_EDITING_MONTH":
      return {
        ...state,
        editingMonth: action.month,
      };
    case "SAVE_MONTH": {
      return {
        ...registerIncomeSource(state, action.manualFixedIncome),
        editingMonth: null,
      };
    }
  }
}

function registerIncomeSource(
  state: UKPayState,
  incomeSource: IncomeSource
): UKPayState {
  const taxMonth = incomeSource.taxMonth;

  const newIncomeSources = state.incomeSources.set(taxMonth, incomeSource);

  const calculatedCompensationValues = resolveCompensation(
    newIncomeSources,
    state.compensationElements,
    state.compensationElementsTopologicalOrder,
    state.taxYear
  );

  return {
    ...state,
    incomeSources: newIncomeSources,
    calculatedCompensationValues,
  };
}
