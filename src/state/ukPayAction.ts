import { TaxPeriod, TaxPeriodData } from "./ukPayState";

export type UKPayAction = {
  type: "REGISTER_PAY_PERIOD";
  taxPeriod: TaxPeriod;
  data: TaxPeriodData;
};
