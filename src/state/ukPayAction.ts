import { UKPayPeriod } from "./ukPayState";

export type UKPayAction =
  | {
      type: "UPDATE_PERIOD";
      yearIdx: number;
      halfIdx: number;
      newValue: UKPayPeriod;
    }
  | {
      type: "UPDATE_BENEFITS";
      benefits: { wellness: number; transport: number };
    }
  | {
      type: "UPDATE_VESTS";
      vests: {
        may: number;
        august: number;
        november: number;
        february: number;
      };
    }
  | {
      type: "UPDATE_PENSION_CONTRIBUTION";
      pensionContribution: {
        employeePercentage: number;
        employerPercentage: number;
      };
    };
