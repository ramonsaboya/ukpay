import CompanyMonthlyCompensation from "../company/CompanyMonthlyCompensation";

export type UKPayAction = {
  type: "REGISTER_MONTHLY_COMPENSATION";
  monthlyCompensation: CompanyMonthlyCompensation;
};
