import { Instruction } from "../abstract/Instruction.js";
import { Type, dataType } from "../symbol/Type.js"
import { Errors } from "../exceptions/Errors.js"
import { Break } from "./Break.js";

export class Case extends Instruction {
    constructor(caseValue, instructions, row, column) {
        super(new Type(dataType.BOOLEAN), row, column);
        this.case = caseValue;
        this.instructions = instructions;
    }

    getExpression(tree, table) {
        return this.case.interpret(tree, table);
    }

    interpret(tree, table) {
        if (this.instructions) {
            for (let ins of this.instructions) {
                let result = ins.interpret(tree, table);
                if (result instanceof Errors) { tree.getErrors().push(result); return result }
                if (result instanceof Break) return result;
            };
        }
        return null
    }

    translate(tree, table) {
        let lNext = `L${tree.getLabel()}`
        if (this.case) {
            let exp = this.case?.translate(tree, table);
            let temp = tree.getTemp()
            tree.assembler += `la t${temp}, ${tree.display[tree.display.length - 1].get('var')}\n`
            tree.assembler += `lw t${temp}, 0(t${temp})\n`
            tree.assembler += `bne t${exp.value}, t${temp}, ${lNext}\n`
        }
        if (this.instructions) {
            for (let instruction of this.instructions) {
                instruction.translate(tree, table)
            }
        }
        tree.assembler += `${lNext}:\n`
    }
}