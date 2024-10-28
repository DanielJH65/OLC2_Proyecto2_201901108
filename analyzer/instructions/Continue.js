import { Instruction } from "../abstract/Instruction.js";
import { dataType, Type } from "../symbol/Type.js";

export class Continue extends Instruction {
    constructor(row, column) {
        super(new Type(dataType.VOID), row, column);
    }

    interpret(tree, table) {
        return this
    }

    translate(tree, table) {
        if (tree.display.length > 0) {
            const data = tree.display[tree.display.length - 1]
            tree.assembler += `j ${data.get('etiInit')}\n`
        }
    }
}