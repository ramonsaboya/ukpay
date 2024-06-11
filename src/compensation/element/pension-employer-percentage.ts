import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatPercentage } from "src/compensation/formatters";

export default abstract class PensionEmployerPercentage extends CompensationElement {
  type = CompensationElementType.PENSION_EMPLOYER_PERCENTAGE;

  rowLabel = "Pension - Employer %";
  formatter = formatPercentage;
  aggregate = null;
}
