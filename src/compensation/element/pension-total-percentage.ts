import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatPercentage } from "src/compensation/formatters";

export default abstract class PensionTotalPercentage extends CompensationElement {
  type = CompensationElementType.PENSION_TOTAL_PERCENTAGE;

  rowLabel = "Pension - Total %";
  formatter = formatPercentage;
  aggregate = null;
}
