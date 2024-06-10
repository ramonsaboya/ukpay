import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class NetIncome extends CompensationElement<number> {
  type = CompensationElementType.NET_INCOME;

  rowLabel = "Net income";
  formatter = formatCurrency;
  aggregate = sum;
}
