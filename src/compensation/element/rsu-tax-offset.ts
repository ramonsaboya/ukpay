import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class RSUTaxOffset extends CompensationElement<number> {
  type = CompensationElementType.RSU_TAX_OFFSET;

  rowLabel = "RSU tax offset";
  formatter = formatCurrency;
  aggregate = sum;
}
