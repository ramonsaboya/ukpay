import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class PensionEmployeeAmount extends CompensationElement {
  type = CompensationElementType.PENSION_EMPLOYEE_AMOUNT;

  rowLabel = "Pension - Employee";
  formatter = formatCurrency;
  aggregate = sum;
}
