import { Map } from "immutable";
import CompanyMonthlyCompensation from "../company/companyMonthlyCompensation";

export type CompanyCompensation = Map<number, CompanyMonthlyCompensation>;
export type UKPayState = {
  companyCompensation: CompanyCompensation;
};

type UKPayStateInitializerArgs = {};
export function defaultUKPayState(
  _args: UKPayStateInitializerArgs
): UKPayState {
  return {
    companyCompensation: Map(),
  };
}
