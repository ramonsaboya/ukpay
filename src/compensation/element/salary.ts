import CompensationElement, {
  CompensationElementType,
} from "./compensationElement";

export default abstract class Salary extends CompensationElement<number> {
  type = CompensationElementType.SALARY;
  dependencies = new Set<CompensationElementType>();

  rowLabel = "Salary";
}
