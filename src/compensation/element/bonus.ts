import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensationElement";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class Bonus extends CompensationElement<number> {
  type = CompensationElementType.BONUS;
  dependencies = new Set<CompensationElementType>();

  rowLabel = "Bonus";
  formatter = formatCurrency;
  aggregate = sum;
}
