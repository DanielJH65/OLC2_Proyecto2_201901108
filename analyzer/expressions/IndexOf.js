import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";
import { Errors } from "../exceptions/Errors.js";

export class IndexOf extends Instruction {
    constructor(id, value, row, column) {
        super(new Type(dataType.INTEGER), row, column);
        this.id = id;
        this.value = value;
    }

    interpret(tree, table) {
        let value = table.getVariable(this.id);
        if (!value) return new Errors("Semantic", `Variable ${this.id} is not defined`);
        if (!(value.getValue() instanceof Array)) return new Errors("Semantic", `Variable ${this.id} is not an array`, this.getLine(), this.getColumn());
        let value2 = this.value.interpret(tree, table)
        if (value2 instanceof Errors) return value2;
        return value.getValue().indexOf(value2);
    }

    translate(tree, table) { }
}