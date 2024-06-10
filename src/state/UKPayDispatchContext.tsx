import React, { useContext } from "react";
import { UKPayAction } from "src/state/uk-pay-action";
import { UKPayState, defaultUKPayState } from "src/state/uk-pay-state";

type DispatchContextType = (action: UKPayAction) => void;

const DispatchContext = React.createContext<DispatchContextType>(() => {});

const UKPayStateContext = React.createContext<UKPayState>(
  defaultUKPayState({})
);

export function UKPayDispatchContext({
  children,
  dispatch,
  ukPayState,
}: {
  children: React.ReactNode;
  dispatch: DispatchContextType;
  ukPayState: UKPayState;
}) {
  return (
    <DispatchContext.Provider value={dispatch}>
      <UKPayStateContext.Provider value={ukPayState}>
        {children}
      </UKPayStateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useUKPayDispatch(): DispatchContextType {
  return useContext(DispatchContext);
}

export function useUKPayState(): UKPayState {
  return useContext(UKPayStateContext);
}
