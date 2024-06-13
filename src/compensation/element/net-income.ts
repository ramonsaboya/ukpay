import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class NetIncome extends CompensationElement {
  type = CompensationElementType.NET_INCOME;

  rowLabel = "Net income";
  formatter = currencyFormatter();
  aggregate = sum;
}
