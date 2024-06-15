import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import NationalInsurance from "src/compensation/element/national-insurance";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import { TaxYear } from "src/hmrc/tax-year";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";
import TaxMonth from "src/hmrc/tax-month";

export default class MetaNationalInsurance
  extends NationalInsurance
  implements IPayslip, IVirtualElement
{
  dependencies = new Set([CompensationElementType.TAXABLE_PAY]);

  fromPayslip(payslip: Payslip): number {
    return payslip.deductions.getOrDefault("EMPLOYEE NIC", 0);
  }

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType,
    taxMonth: TaxMonth,
    taxYear: TaxYear
  ): number {
    const taxablePay = currentMonthValues.get(
      CompensationElementType.TAXABLE_PAY
    )!;

    return taxYear.taxYearMonths
      .get(taxMonth)!
      .nationalInsuranceRates.reduce((acc, band) => {
        const lowerLimit = band.annualLowerLimit / 12;
        const upperLimit = band.annualUpperLimit / 12;

        const payInBand = Math.max(
          0,
          Math.min(taxablePay, upperLimit) - lowerLimit
        );
        const nationalInsuranceInBand = payInBand * band.rate;

        return acc + nationalInsuranceInBand;
      }, 0);
  }
}
