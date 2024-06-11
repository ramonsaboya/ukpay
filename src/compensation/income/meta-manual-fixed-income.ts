import { CompensationElementType } from "src/compensation/element/compensation-element";
import ManualFixedIncome from "src/compensation/income/manual-fixed-income";
import TaxMonth from "src/taxMonth";

export default class MetaManualFixedIncome extends ManualFixedIncome {
  public readonly salary: number;
  public readonly bonus: number;
  public readonly taxableBenefits: number;
  public readonly benefitsInKind: number;
  public readonly pensionEmployeePercentage: number;
  public readonly rsuVest: number;
  public readonly rsuTaxOffset: number;
  public readonly rsuOverwithheldRefund: number;

  constructor(
    taxMonth: TaxMonth,
    values: Map<CompensationElementType, number>
  ) {
    super();
    this._taxMonth = taxMonth;

    this.salary = values.get(CompensationElementType.SALARY) ?? 0;
    this.bonus = values.get(CompensationElementType.BONUS) ?? 0;
    this.taxableBenefits =
      values.get(CompensationElementType.TAXABLE_BENEFITS) ?? 0;
    this.benefitsInKind =
      values.get(CompensationElementType.BENEFITS_IN_KIND) ?? 0;
    this.pensionEmployeePercentage =
      values.get(CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE) ?? 0;
    this.rsuVest = values.get(CompensationElementType.RSU_VEST) ?? 0;
    this.rsuTaxOffset = values.get(CompensationElementType.RSU_TAX_OFFSET) ?? 0;
    this.rsuOverwithheldRefund =
      values.get(CompensationElementType.RSU_OVERWITHHELD_REFUND) ?? 0;
  }
}
