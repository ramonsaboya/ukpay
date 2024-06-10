import {
  CompensationElementType,
  IVirtualElement,
} from "src/compensation/element/compensation-element";
import NetPayWithRSU from "src/compensation/element/net-pay-with-rsu";
import { CalculatedMonthCompensationValuesByElementType } from "src/state/uk-pay-state";

export default class MetaNetPayWithRSU
  extends NetPayWithRSU
  implements IVirtualElement<number>
{
  dependencies = new Set([
    CompensationElementType.NET_PAY,
    CompensationElementType.RSU_VEST,
    CompensationElementType.RSU_TAX_OFFSET,
    CompensationElementType.RSU_OVERWITHHELD_REFUND,
  ]);

  fromState(
    currentMonthValues: CalculatedMonthCompensationValuesByElementType
  ): number {
    const netPay = currentMonthValues.get(CompensationElementType.NET_PAY)!;
    const rsuVest = currentMonthValues.get(CompensationElementType.RSU_VEST)!;
    const rsuTaxOffset = currentMonthValues.get(
      CompensationElementType.RSU_TAX_OFFSET
    )!;
    const rsuOverwithheldRefund = currentMonthValues.get(
      CompensationElementType.RSU_OVERWITHHELD_REFUND
    )!;

    return netPay + rsuVest - rsuTaxOffset - rsuOverwithheldRefund;
  }
}
