import { UKPayAction } from "./ukPayAction";
import { UKPayState } from "./ukPayState";

export function ukPayReducer(
  state: UKPayState,
  action: UKPayAction
): UKPayState {
  switch (action.type) {
    case "REGISTER_MONTHLY_COMPENSATION":
      const taxPeriodId = action.monthlyCompensation.payslip.period.id;

      return {
        ...state,
        companyMonthlyCompensation: state.companyMonthlyCompensation.set(
          taxPeriodId,
          action.monthlyCompensation
        ),
      };
  }
}
