import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class IncomeTax extends CompensationElement {
  type = CompensationElementType.INCOME_TAX;

  rowLabel = "Income tax";
  formatter = currencyFormatter();
  aggregate = sum;
}
