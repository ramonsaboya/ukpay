import { UKPayAction } from "./ukPayAction";
import { UKPayState } from "./ukPayState";

export function ukPayReducer(
  state: UKPayState,
  action: UKPayAction
): UKPayState {
  switch (action.type) {
    case "REGISTER_PAY_PERIOD":
      return {
        ...state,
        periods: state.periods.set(action.taxPeriod, action.data),
      };
  }
}
