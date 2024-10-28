import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";
import { Errors } from "../exceptions/Errors.js";

export class VarAssignment extends Instruction {
    constructor(id, expression, row, col) {
        super(new Type(dataType.VOID), row, col)
        this.id = id
        this.expression = expression
    }

    interpret(tree, table) {
        const variable = table.getVariable(this.id)
        if (variable === null) return new Errors("Semantic", `Variable ${this.id} does not exists`, this.getLine(), this.getColumn())
        this.getType().setType(variable.getType().getType())
        const value = this.expression?.interpret(tree, table)

        if (value instanceof Error) return value
        if (this.expression.getType().getType() !== this.getType().getType()) {
            return new Errors("Semantic", `Type mismatch, expected ${this.getType().getType()} but got ${this.expression.getType().getType()}`, this.getLine(), this.getColumn())
        }

        variable.setValue(value)
        return null
    }

    translate(tree, table) {
        let exp = this.expression?.translate(tree, table)
        if (exp.type != dataType.STRING) {
            let temp = tree.getTemp()
            tree.getTempPrev()
            tree.assembler += `la t${temp}, ${this.id}\n`
            tree.assembler += `sw t${exp.value}, 0(t${temp})\n`
        }
    }
}