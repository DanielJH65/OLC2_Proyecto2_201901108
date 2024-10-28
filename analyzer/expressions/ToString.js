import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";
import { Errors } from "../exceptions/Errors.js";

export class ToString extends Instruction {
    constructor(string, row, column) {
        super(new Type(dataType.STRING), row, column);
        this.string = string;
    }

    interpret(tree, table) {
        let value = this.string.interpret(tree, table)
        if (this.string.getType().getType() === dataType.STRING) return new Errors("Semantic", `Type mismatch, expected numeric o boolean but got ${this.string.getType().getType()}`, this.getLine(), this.getColumn());
        return value.toString();
    }
}