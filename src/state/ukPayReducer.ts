import { UKPayAction } from "./ukPayAction";
import { UKPayState } from "./ukPayState";

export function ukPayReducer(state: UKPayState, action: UKPayAction): UKPayState {
  switch (action.type) {
    case "UPDATE_PERIOD":
      const currentPeriods = state.periods;

      const currentYear = currentPeriods[action.yearIdx];
      const newYear = [...currentYear.slice(0, action.halfIdx), action.newValue, ...currentYear.slice(action.halfIdx + 1)];

      const newPeriods = [...currentPeriods.slice(0, action.yearIdx), newYear, ...currentPeriods.slice(action.yearIdx + 1)];
      return { ...state, periods: newPeriods };
    case "UPDATE_BENEFITS":
      return { ...state, benefits: action.benefits };
    case "UPDATE_VESTS":
      return { ...state, vests: action.vests };
    case "UPDATE_PENSION_CONTRIBUTION":
      return { ...state, pensionContribution: action.pensionContribution };
  }
}
