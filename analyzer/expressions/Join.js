import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";
import { Errors } from "../exceptions/Errors.js";

export class Join extends Instruction {
    constructor(id, row, column) {
        super(new Type(dataType.STRING), row, column);
        this.id = id;
    }

    interpret(tree, table) {
        let value = table.getVariable(this.id);
        if (!value) return new Errors("Semantic", `Variable ${this.id} is not defined`);
        if (!(value.getValue() instanceof Array)) return new Errors("Semantic", `Variable ${this.id} is not an array`, this.getLine(), this.getColumn());
        return value.getValue().join(", ")
    }

    translate(tree, table) { }
}