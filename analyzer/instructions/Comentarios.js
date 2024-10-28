import { Instruction } from "../abstract/Instruction.js";
import { Type, dataType } from "../symbol/Type.js";

export class Comentarios extends Instruction {
    constructor(single, data, row, column) {
        super(new Type(dataType.VOID), row, column)
        this.data = data
        this.single = single
    }

    interpret(tree, table) {

    }

    translate(tree, table) {
        tree.assembler += this.data
    }
}