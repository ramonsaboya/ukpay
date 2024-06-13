import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { percentageFormatter } from "src/compensation/formatters";

export default abstract class PensionEmployerPercentage extends CompensationElement {
  type = CompensationElementType.PENSION_EMPLOYER_PERCENTAGE;

  rowLabel = "Pension - Employer %";
  formatter = percentageFormatter();
  aggregate = null;
}
