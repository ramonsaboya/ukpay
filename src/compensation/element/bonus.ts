import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class Bonus extends CompensationElement<number> {
  type = CompensationElementType.BONUS;

  rowLabel = "Bonus";
  formatter = formatCurrency;
  aggregate = sum;
}
