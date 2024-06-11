import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import IncomeTax from "src/compensation/element/income-tax";
import Payslip, { IPayslip } from "src/compensation/income/payslip/payslip";
import { TaxYear } from "src/hmrc/tax-year-builder";
import {
  CalculatedMonthCompensationValuesByElementType,
  CalculatedCompensationValuesByMonth,
} from "src/state/uk-pay-state";
import TaxMonth from "src/taxMonth";

export default class MetaIncomeTax
  extends IncomeTax
  implements IPayslip, IVirtualElement
{
  dependencies = new Set([CompensationElementType.TAXABLE_PAY]);

  fromPayslip(payslip: Payslip): number {
    return payslip.deductions.getOrDefault("TAX PAID", 0);
  }

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType,
    taxMonth: TaxMonth,
    previousMonthsValues: CalculatedCompensationValuesByMonth,
    taxYear: TaxYear
  ): number {
    const cumulativeTaxablePay =
      this.calculateCumulativeElementUntilLastMonth(
        previousMonthsValues,
        taxMonth,
        CompensationElementType.TAXABLE_PAY
      ) + currentMonthValues.get(CompensationElementType.TAXABLE_PAY)!;
    const cumulativeTaxPaidUntilLastMonth =
      this.calculateCumulativeElementUntilLastMonth(
        previousMonthsValues,
        taxMonth,
        CompensationElementType.INCOME_TAX
      );

    const cumulativeTaxPaid = taxYear
      .get(taxMonth)!
      .taxRates.reduce((acc, band) => {
        const cumulativeLowerLimit = (band.annualLowerLimit / 12) * taxMonth;
        const cumulativeUpperLimit = (band.annualUpperLimit / 12) * taxMonth;

        const payInBand = Math.max(
          0,
          Math.min(cumulativeTaxablePay, cumulativeUpperLimit) -
            cumulativeLowerLimit
        );
        const taxInBand = payInBand * band.rate;

        return acc + taxInBand;
      }, 0);

    return Math.max(0, cumulativeTaxPaid - cumulativeTaxPaidUntilLastMonth);
  }

  private calculateCumulativeElementUntilLastMonth(
    previousMonthsValues: CalculatedCompensationValuesByMonth,
    taxMonth: TaxMonth,
    elementType: CompensationElementType
  ): number {
    return previousMonthsValues.reduce((acc, monthValues, month) => {
      if (month >= taxMonth) {
        return acc;
      }

      return acc + (monthValues.get(elementType) ?? 0);
    }, 0);
  }
}
