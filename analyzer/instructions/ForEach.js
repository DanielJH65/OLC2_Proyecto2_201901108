import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";
import { SymbolsTable } from "../symbol/SymbolsTable.js";
import { Errors } from "../exceptions/Errors.js";
import { Break } from "./Break.js";
import { Continue } from "./Continue.js";
import { Return } from "./Return.js";
import { VarAssignment } from "./VarAssignment.js";

export class ForEach extends Instruction {
    constructor(statement, id, instructions, line, column) {
        super(new Type(dataType.VOID), line, column)
        this.statement = statement
        this.id = id
        this.instructions = instructions
    }

    interpret(tree, table) {

        let list = table.getVariable(this.id);
        if (!list) return new Errors("Semantic", `Variable ${this.id} is not defined`);
        if (!(list.getValue() instanceof Array)) return new Errors("Semantic", `Variable ${this.id} is not a list`);
        let isBreak = false;
        for (let element of list.getValue()) {
            let newTable2 = new SymbolsTable(table);
            newTable2.setName("ForEach " + this.getLine())
            this.statement.interpret(tree, newTable2);
            newTable2.getVariable(this.statement.id).setValue(element);
            for (let instruction of this.instructions) {
                if (!(instruction instanceof Function)) {
                    if (instruction instanceof VarAssignment) {
                        if (instruction.id === this.statement.id) return new Errors("Semantic", `Variable ${this.statement.id} cannot be modified`, instruction.line, instruction.column);
                    }
                    const result = instruction.interpret(tree, newTable2)
                    if (result instanceof Errors) return result
                    if (result instanceof Break) { isBreak = true; break }
                    if (result instanceof Continue) break
                    if (result instanceof Return) return result
                }
            }
            if (isBreak) break
        }
    }
}