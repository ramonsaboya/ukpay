import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatPercentage } from "src/compensation/formatters";

export default abstract class PensionEmployeePercentage extends CompensationElement {
  type = CompensationElementType.PENSION_EMPLOYEE_PERCENTAGE;

  rowLabel = "Pension - Employee %";
  formatter = formatPercentage;
  aggregate = null;
}
