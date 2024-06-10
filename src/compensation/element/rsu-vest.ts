import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class RSUVest extends CompensationElement<number> {
  type = CompensationElementType.RSU_VEST;

  rowLabel = "RSU vest value";
  formatter = formatCurrency;
  aggregate = sum;
}
