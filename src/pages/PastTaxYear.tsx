import { useReducer } from "react";
import UKPayTable from "src/UKPayTable";
import { UKPayDispatchContext } from "src/state/UKPayDispatchContext";
import { ukPayReducer } from "src/state/uk-pay-reducer";
import { defaultUKPayState } from "src/state/uk-pay-state";

export default function PastTaxYear() {
  const [state, dispatch] = useReducer(
    ukPayReducer,
    { allowEditing: false },
    defaultUKPayState
  );

  return (
    <UKPayDispatchContext dispatch={dispatch} ukPayState={state}>
      <UKPayTable />
    </UKPayDispatchContext>
  );
}
