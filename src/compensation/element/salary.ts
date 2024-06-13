import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class Salary extends CompensationElement {
  type = CompensationElementType.SALARY;

  rowLabel = "Salary";
  formatter = currencyFormatter();
  aggregate = sum;
}
