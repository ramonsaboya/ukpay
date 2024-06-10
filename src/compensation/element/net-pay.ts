import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class NetPay extends CompensationElement<number> {
  type = CompensationElementType.NET_PAY;

  rowLabel = "Net pay";
  formatter = formatCurrency;
  aggregate = sum;
}
