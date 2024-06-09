import CompensationElementBase, {
  CompensationElementType,
} from "./compensationElementBase";

export default abstract class Salary extends CompensationElementBase<number> {
  type = CompensationElementType.SALARY;
}
