import resolveCompensation from "src/compensation/compensation-resolver";
import { UKPayAction } from "src/state/uk-pay-action";
import { UKPayState } from "src/state/uk-pay-state";

export function ukPayReducer(
  state: UKPayState,
  action: UKPayAction
): UKPayState {
  switch (action.type) {
    case "REGISTER_INCOME_SOURCE":
      const taxMonth = action.incomeSource.taxMonth;

      const newIncomeSources = state.incomeSources.set(
        taxMonth,
        action.incomeSource
      );

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
}
