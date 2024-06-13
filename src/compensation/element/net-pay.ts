import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class NetPay extends CompensationElement {
  type = CompensationElementType.NET_PAY;

  rowLabel = "Net pay";
  formatter = currencyFormatter();
  aggregate = sum;
}
