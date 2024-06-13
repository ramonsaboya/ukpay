import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { percentageFormatter } from "src/compensation/formatters";

export default abstract class PensionEmployeePercentage extends CompensationElement {
  type = CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE;

  rowLabel = "Pension - Employee %";
  formatter = percentageFormatter();
  aggregate = null;
}
