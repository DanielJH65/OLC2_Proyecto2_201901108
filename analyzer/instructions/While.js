import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { SymbolsTable } from "../symbol/SymbolsTable.js";
import { Type, dataType } from "../symbol/Type.js";
import { Break } from "./Break.js";
import { Continue } from "./Continue.js";
import { Return } from "./Return.js";

export class While extends Instruction {
    constructor(condition, instructions, line, column) {
        super(new Type(dataType.VOID), line, column)
        this.condition = condition
        this.instructions = instructions
    }

    interpret(tree, table) {
        let result = this.condition.interpret(tree, table)
        if (result instanceof Errors) return result
        if (this.condition.getType().getType() != dataType.BOOLEAN) return new Errors("Semantic", `The condition must be a boolean`, this.getLine(), this.getColumn())
        while (this.condition.interpret(tree, table)) {
            const newTable = new SymbolsTable(table)
            newTable.setName("While " + this.getLine())
            for (let function_ of this.instructions) {
                if (function_ instanceof Function) {
                    if (newTable.getFunction(function_.name) !== null) return new Errors('Semantic', `Function ${function_.name} already exists`, function_.getLine(), function_.getColumn());
                    newTable.setFunction(function_)
                }
            }
            for (const instruction of this.instructions) {
                if (!(instruction instanceof Function)) {
                    const result2 = instruction.interpret(tree, newTable)
                    if (result2 instanceof Errors) return result2
                    if (result2 instanceof Break) return null
                    if (result2 instanceof Continue) break
                    if (result2 instanceof Return) return result2
                }
            }
        }
    }

    translate(tree, table) {
        let lInit = `L${tree.getLabel()}`
        tree.assembler += `${lInit}:\n`
        let exp = this.condition.translate(tree, table);
        let data = new Map()
        data.set("etiInit", lInit)
        data.set("etiExit", exp.etiF)
        tree.display.push(data)
        tree.assembler += `${exp.etiV}:`
        for (let instruction of this.instructions) {
            instruction.translate(tree, table)
        }
        tree.assembler += `j ${lInit}\n`
        tree.assembler += `${exp.etiF}:\n`
        tree.display.pop()
    }
}