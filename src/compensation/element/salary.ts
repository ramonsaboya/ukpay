import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensationElement";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class Salary extends CompensationElement<number> {
  type = CompensationElementType.SALARY;
  dependencies = new Set<CompensationElementType>();

  rowLabel = "Salary";
  formatter = formatCurrency;
  aggregate = sum;
}
