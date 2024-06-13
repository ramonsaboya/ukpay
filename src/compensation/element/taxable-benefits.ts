import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class TaxableBenefits extends CompensationElement {
  type = CompensationElementType.TAXABLE_BENEFITS;

  rowLabel = "Taxable benefits";
  formatter = currencyFormatter();
  aggregate = sum;
}
