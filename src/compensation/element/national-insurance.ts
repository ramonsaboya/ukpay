import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class NationalInsurance extends CompensationElement {
  type = CompensationElementType.NATIONAL_INSURANCE;

  rowLabel = "National insurance";
  formatter = currencyFormatter();
  aggregate = sum;
}
