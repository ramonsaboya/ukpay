import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { percentageFormatter } from "src/compensation/formatters";

export default abstract class PensionTotalPercentage extends CompensationElement {
  type = CompensationElementType.PENSION_TOTAL_PERCENTAGE;

  rowLabel = "Pension - Total %";
  formatter = percentageFormatter();
  aggregate = null;
}
