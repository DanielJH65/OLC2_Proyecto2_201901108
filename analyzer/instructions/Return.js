import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";

export class Return extends Instruction {
    constructor(value, row, column) {
        super(new Type(dataType.VOID), row, column);
        this.value = value;
        this.finalValue = null;
    }

    interpret(tree, table) {
        if (this.value) {
            const interpretValue = this.value.interpret(tree, table);
            if (interpretValue instanceof Error) return interpretValue;
            this.getType().setType(this.value.getType().getType());
            this.finalValue = interpretValue;
        }
        return this;
    }
}