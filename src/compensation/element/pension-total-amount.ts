import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class PensionTotalAmount extends CompensationElement {
  type = CompensationElementType.PENSION_TOTAL_AMOUNT;

  rowLabel = "Pension - Total";
  formatter = formatCurrency;
  aggregate = sum;
}
