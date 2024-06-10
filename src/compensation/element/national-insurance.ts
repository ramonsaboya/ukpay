import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { formatCurrency } from "src/compensation/formatters";

export default abstract class NationalInsurance extends CompensationElement<number> {
  type = CompensationElementType.NATIONAL_INSURANCE;

  rowLabel = "National insurance";
  formatter = formatCurrency;
  aggregate = sum;
}
