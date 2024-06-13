import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class AdjustedIncome extends CompensationElement {
  type = CompensationElementType.ADJUSTED_INCOME;

  rowLabel = "Adjusted income";
  formatter = currencyFormatter();
  aggregate = sum;
}
