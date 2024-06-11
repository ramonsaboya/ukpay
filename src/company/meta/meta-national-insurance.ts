import { CompensationElementType } from "src/compensation/element/compensation-element";
import NationalInsurance from "src/compensation/element/national-insurance";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaNationalInsurance
  extends NationalInsurance
  implements IPayslip
{
  dependencies = new Set<CompensationElementType>();

  fromPayslip(payslip: Payslip): number {
    return payslip.deductions.getOrDefault("EMPLOYEE NIC", 0);
  }
}
