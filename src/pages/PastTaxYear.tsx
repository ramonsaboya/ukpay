import { useReducer } from "react";
import { UKPayDispatchContext } from "src/state/UKPayDispatchContext";
import { ukPayReducer } from "src/state/uk-pay-reducer";
import { defaultUKPayState } from "src/state/uk-pay-state";
import CompensationSummary from "src/summary/CompensationSummary";

export default function PastTaxYear() {
  const [state, dispatch] = useReducer(
    ukPayReducer,
    { allowEditing: false, taxYear: "2023/24" },
    defaultUKPayState
  );

  return (
    <UKPayDispatchContext dispatch={dispatch} ukPayState={state}>
      <CompensationSummary />
    </UKPayDispatchContext>
  );
}
