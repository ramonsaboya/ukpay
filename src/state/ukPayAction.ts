import CompanyMonthlyCompensation from "../company/companyMonthlyCompensation";

export type UKPayAction = {
  type: "REGISTER_MONTHLY_COMPENSATION";
  monthlyCompensation: CompanyMonthlyCompensation;
};
