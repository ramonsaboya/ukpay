import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensationElement";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class TaxableBenefits extends CompensationElement<number> {
  type = CompensationElementType.TAXABLE_BENEFITS;
  dependencies = new Set<CompensationElementType>();

  rowLabel = "Taxable Benefits";
  formatter = formatCurrency;
  aggregate = sum;
}
