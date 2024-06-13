import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class BenefitsInKind extends CompensationElement {
  type = CompensationElementType.BENEFITS_IN_KIND;

  rowLabel = "Benefits in kind";
  formatter = currencyFormatter();
  aggregate = sum;
}
