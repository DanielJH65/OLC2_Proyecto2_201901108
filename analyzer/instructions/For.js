import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";
import { SymbolsTable } from "../symbol/SymbolsTable.js";
import { Errors } from "../exceptions/Errors.js";
import { Break } from "./Break.js";
import { Continue } from "./Continue.js";
import { Return } from "./Return.js";

export class For extends Instruction {
    constructor(statement, condition, increment, instructions, line, column) {
        super(new Type(dataType.VOID), line, column)
        this.statement = statement
        this.condition = condition
        this.increment = increment
        this.instructions = instructions
    }

    interpret(tree, table) {
        let newTable1 = new SymbolsTable(table)
        newTable1.setName("For " + this.getLine())
        let statement = this.statement.interpret(tree, newTable1)
        if (statement instanceof Errors) return statement

        let condition = this.condition.interpret(tree, newTable1)
        if (condition instanceof Errors) return condition;
        if (this.condition.getType().getType() != dataType.BOOLEAN) return new Errors("Semantic", `Condition must be a Boolean`, this.getLine(), this.getColumn());

        let isBreak = false;

        while (this.condition.interpret(tree, newTable1)) {
            let newTable2 = new SymbolsTable(newTable1)
            newTable2.setName("For " + this.getLine())
            for (let function_ of this.instructions) {
                if (function_ instanceof Function) {
                    if (newTable2.getFunction(function_.name) !== null) return new Errors('Semantic', `Function ${function_.name} already exists`, function_.getLine(), function_.getColumn());
                    newTable2.setFunction(function_)
                }
            }
            for (let instruction of this.instructions) {
                if (!(instruction instanceof Function)) {
                    const result = instruction.interpret(tree, newTable2)
                    if (result instanceof Errors) return result
                    if (result instanceof Break) { isBreak = true; break }
                    if (result instanceof Continue) break
                    if (result instanceof Return) return result
                }
            }
            if (isBreak) break
            this.increment.interpret(tree, newTable1)
        }
    }
}