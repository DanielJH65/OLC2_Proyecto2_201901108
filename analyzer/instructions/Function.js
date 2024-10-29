import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { Break } from "./Break.js";
import { Continue } from "./Continue.js";
import { Return } from "./Return.js";
import { SymbolReport } from "../symbol/SymbolReport.js";

export class Function extends Instruction {
    constructor(type, name, params, instructions, row, col) {
        super(type, row, col);
        this.name = name;
        this.params = params;
        this.instructions = instructions;
        this.global = false;
    }

    interpret(tree, table) {
        for (let function_ of this.instructions) {
            if (function_ instanceof Function) {
                if (table.getFunction(function_.name) !== null) return new Errors('Semantic', `Function ${function_.name} already exists`, function_.getLine(), function_.getColumn());
                table.setFunction(function_)
                tree.SymbolsReport.push(new SymbolReport(function_.name, "Función", function_.getType().getType(), null, table.getName(), function_.getLine(), function_.getColumn()))
            }
        }
        for (let ins of this.instructions) {
            if (!(ins instanceof Function)) {
                let result = ins.interpret(tree, table);
                if (result instanceof Error) return result;
                if (result instanceof Break || result instanceof Continue) return new Errors("Semantic", "Break and continue must go within a loop", this.getLine(), this.getColumn());
                if (result instanceof Return) {
                    if (result.getType().getType() != this.getType().getType()) return new Errors("Semantic", "Return type does not match function type", this.getLine(), this.getColumn());
                    return result;
                }
            }
        }
        return null;
    }

    translate(tree, table) {
        let prev = tree.assembler
        tree.assembler = ""
        tree.functions += `${this.name}:\n`
        for (let instruction of this.instructions) {
            instruction.translate(tree, table)
        }
        tree.functions += tree.assembler
        tree.functions += 'ret\n\n'
        tree.assembler = prev
    }
}