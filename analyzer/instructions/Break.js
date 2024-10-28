import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { dataType, Type } from "../symbol/Type.js";

export class Break extends Instruction {
    constructor(row, column) {
        super(new Type(dataType.VOID), row, column);
    }

    interpret(tree, table) {
        return this
    }

    translate(tree, table) {
        if (tree.display.length > 0) {
            const data = tree.display[tree.display.length - 1]
            if (data.get('type') == 'for') {
                tree.assembler += `j ${data.get('etiBreak')}\n`
            } else {
                tree.assembler += `j ${data.get('etiExit')}\n`
            }
        }
    }
}