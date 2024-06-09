export enum IncomeSourceType {
  PAYSLIP,
  SCHWAB_REPORT,
  MANUAL_FIXED,
  MANUAL_PREDICTED,
  COMPANY_META,
}

export default abstract class IncomeSource {
  public abstract readonly type: IncomeSourceType;
  public abstract readonly order: number;
}
