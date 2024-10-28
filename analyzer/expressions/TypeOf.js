import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";
import { Errors } from "../exceptions/Errors.js";

export class TypeOf extends Instruction {
    constructor(string, row, column) {
        super(new Type(dataType.DOUBLE), row, column);
        this.string = string;
    }

    interpret(tree, table) {
        let value = this.string.interpret(tree, table)
        return this.string.getType().getType();
    }
}