import { Instruction } from "../abstract/Instruction.js";
import { SymbolsTable } from "../symbol/SymbolsTable.js";
import { Type, dataType } from "../symbol/Type.js";
import { Errors } from "../exceptions/Errors.js";
import { Break } from "./Break.js";
import { Continue } from "./Continue.js";
import { Return } from "./Return.js";

export class If extends Instruction {
    constructor(condition, instructionsT, instructionsF, row, column) {
        super(new Type(dataType.VOID), row, column);
        this.condition = condition;
        this.instructionsT = instructionsT;
        this.instructionsF = instructionsF;
    }

    interpret(tree, table) {
        const condition = this.condition.interpret(tree, table);
        if (condition instanceof Errors) return condition;
        if (this.condition.getType().getType() != dataType.BOOLEAN) return new Errors("Semantic", `Condition must be a boolean`, this.getLine(), this.getColumn());
        const newTable = new SymbolsTable(table);
        newTable.setName("If " + this.getLine())
        if (condition) {
            for (let function_ of this.instructionsT) {
                if (function_ instanceof Function) {
                    if (newTable.getFunction(function_.name) !== null) return new Errors('Semantic', `Function ${function_.name} already exists`, function_.getLine(), function_.getColumn());
                    newTable.setFunction(function_)
                }
            }
            for (const instruction of this.instructionsT) {
                if (!(instruction instanceof Function)) {
                    const result = instruction.interpret(tree, newTable);
                    if (result instanceof Errors) return result;
                    if (result instanceof Break || result instanceof Continue) return result
                    if (result instanceof Return) return result;
                }
            }
        } else {
            if (this.instructionsF) {
                for (let function_ of this.instructionsF) {
                    if (function_ instanceof Function) {
                        if (newTable.getFunction(function_.name) !== null) return new Errors('Semantic', `Function ${function_.name} already exists`, function_.getLine(), function_.getColumn());
                        newTable.setFunction(function_)
                    }
                }
                for (const instruction of this.instructionsF) {
                    if (!(instruction instanceof Function)) {
                        const result = instruction.interpret(tree, newTable);
                        if (result instanceof Errors) return result;
                        if (result instanceof Break || result instanceof Continue) return result
                        if (result instanceof Return) return result;
                    }
                }
            }
        }
        return null;
    }

    translate(tree, table) {
        let exp = this.condition.translate(tree, table);
        let lExit = `L${tree.getLabel()}`

        tree.assembler += `${exp.etiV}:\n`
        for (let instruction of this.instructionsT) {
            instruction.translate(tree, table)
        }
        tree.assembler += `j ${lExit}\n`
        tree.assembler += `${exp.etiF}:\n`
        if (this.instructionsF) {
            for (let instruction of this.instructionsF) {
                instruction.translate(tree, table)
            }
        }
        tree.assembler += `${lExit}:\n`
    }
}