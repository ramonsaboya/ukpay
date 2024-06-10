import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensationElement";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class BenefitsInKind extends CompensationElement<number> {
  type = CompensationElementType.BENEFITS_IN_KIND;
  dependencies = new Set<CompensationElementType>();

  rowLabel = "Benefits in kind";
  formatter = formatCurrency;
  aggregate = sum;
}
