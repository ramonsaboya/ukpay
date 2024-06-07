import { Map } from "immutable";
import CompanyMonthlyCompensation from "../company/CompanyMonthlyCompensation";

export type UKPayState = {
  companyMonthlyCompensation: Map<number, CompanyMonthlyCompensation>;
};

type UKPayStateInitializerArgs = {};
export function defaultUKPayState(
  _args: UKPayStateInitializerArgs
): UKPayState {
  return {
    companyMonthlyCompensation: Map(),
  };
}
