import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class TaxablePay extends CompensationElement {
  type = CompensationElementType.TAXABLE_PAY;

  rowLabel = "Taxable pay";
  formatter = currencyFormatter();
  aggregate = sum;
}
