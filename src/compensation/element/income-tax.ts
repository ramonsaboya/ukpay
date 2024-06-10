import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class IncomeTax extends CompensationElement<number> {
  type = CompensationElementType.INCOME_TAX;

  rowLabel = "Income tax";
  formatter = formatCurrency;
  aggregate = sum;
}
