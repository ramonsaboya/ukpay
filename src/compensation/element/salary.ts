import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class Salary extends CompensationElement<number> {
  type = CompensationElementType.SALARY;

  rowLabel = "Salary";
  formatter = formatCurrency;
  aggregate = sum;
}
