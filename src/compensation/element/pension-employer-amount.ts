import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class PensionEmployerAmount extends CompensationElement {
  type = CompensationElementType.PENSION_EMPLOYER_AMOUNT;

  rowLabel = "Pension - Employer";
  formatter = formatCurrency;
  aggregate = sum;
}
