import CompensationElement, {
  CompensationElementType,
} from "src/compensation/element/compensationElement";

export default abstract class Salary extends CompensationElement<number> {
  type = CompensationElementType.SALARY;
  dependencies = new Set<CompensationElementType>();

  rowLabel = "Salary";
}
