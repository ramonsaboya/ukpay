import { sum } from "src/compensation/aggregators";
import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensation-element";
import { currencyFormatter } from "src/compensation/formatters";

export default abstract class RSUOverwithheldRefund extends CompensationElement {
  type = CompensationElementType.RSU_OVERWITHHELD_REFUND;

  rowLabel = "RSU overwithheld refund";
  formatter = currencyFormatter();
  aggregate = sum;
}
