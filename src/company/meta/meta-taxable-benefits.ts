import { CompensationElementType } from "src/compensation/element/compensation-element";
import TaxableBenefits from "src/compensation/element/taxable-benefits";
import { IManualFixedIncome } from "src/compensation/income/manual-fixed-income";
import MetaManualFixedIncome from "src/compensation/income/meta-manual-fixed-income";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";

export default class MetaTaxableBenefits
  extends TaxableBenefits
  implements IPayslip, IManualFixedIncome
{
  dependencies = new Set<CompensationElementType>();

  fromManualFixedIncome(manualFixedIncome: MetaManualFixedIncome): number {
    return manualFixedIncome.taxableBenefits;
  }

  fromPayslip(payslip: Payslip): number {
    return payslip.earnings.sum("WELLNESS", "TRANSPORTATION");
  }
}
