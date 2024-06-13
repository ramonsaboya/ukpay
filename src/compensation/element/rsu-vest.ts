import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class RSUVest extends CompensationElement {
  type = CompensationElementType.RSU_VEST;

  rowLabel = "RSU vest value";
  formatter = currencyFormatter();
  aggregate = sum;
}
