import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { dataType, Type } from "../symbol/Type.js";

export class VarAccess extends Instruction {
    constructor(id, position, line, column) {
        super(new Type(dataType.VOID), line, column)
        this.id = id
        this.position = position
    }

    interpret(tree, table) {
        let variable = table.getVariable(this.id)
        if (variable === null) return new Errors("Semantic", `Variable ${this.id} does not exists`, this.getLine(), this.getColumn());
        this.getType().setType(variable?.getType().getType())
        if (this.position && !(variable?.getValue() instanceof Array)) return new Errors("Semantic", `Variable ${this.id} is not an array`, this.getLine(), this.getColumn());
        if (this.position) {
            for (let i = 0; i < this.position.length; i++) {
                if (i == 0) {
                    if (this.position[i].interpret(tree, table) >= variable.getValue().length) return new Errors("Semantic", `Index out of bounds`, this.getLine(), this.getColumn());
                    variable = variable.getValue()[this.position[i].interpret(tree, table)]
                } else {
                    if (this.position[i].interpret(tree, table) >= variable.length) return new Errors("Semantic", `Index out of bounds`, this.getLine(), this.getColumn());
                    variable = variable[this.position[i].interpret(tree, table)]
                }
            }
            return variable
        }
        return variable?.getValue()
    }

    translate(tree, table) {
        let temp = tree.getTemp()
        console.log(tree.func)
        if (tree.params && tree.func.params.findIndex((el) => this.id === el.get('id')) >= 0) {
            console.log(tree.params)
            tree.assembler += `add t${temp}, a${tree.paramsCont++}, zero\n`
        } else {
            tree.assembler += `la t${temp}, ${this.id}\n`
            tree.assembler += `lw t${temp}, 0(t${temp})\n`
        }
        return { 'value': temp, 'type': dataType.INTEGER }
    }
}