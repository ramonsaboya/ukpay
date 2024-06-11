import { CompensationElementType } from "src/compensation/element/compensation-element";
import RSUVest from "src/compensation/element/rsu-vest";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaRSUVest extends RSUVest implements IPayslip {
  dependencies = new Set<CompensationElementType>();

  fromPayslip(payslip: Payslip): number {
    return payslip.grossBenefits.getOrDefault("RSUS", 0);
  }
}
