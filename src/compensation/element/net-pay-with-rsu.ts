import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class NetPayWithRSU extends CompensationElement {
  type = CompensationElementType.NET_PAY_WITH_RSU;

  rowLabel = "Net pay (with RSU)";
  formatter = currencyFormatter();
  aggregate = sum;
}
