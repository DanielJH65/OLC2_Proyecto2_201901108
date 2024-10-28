import { Instruction } from "../abstract/Instruction.js"
import { li } from "../riscv/instructions.js"
import { dataType } from "../symbol/Type.js"

export class Native extends Instruction {
    #value
    constructor(type, value, line, column) {
        super(type, line, column)
        this.#value = value
    }
    interpret(tree, table) {
        return this.#value
    }

    translate(tree, table) {
        let type1 = this.getType().getType()
        if (type1 == dataType.INTEGER) {
            let numTemp = tree.getTemp()
            tree.assembler += li(`t${numTemp}`, this.#value) + '\n'
            return { 'value': numTemp, 'type': type1 }
        } else if (type1 == dataType.STRING) {
            let numMsg = tree.getMsg()
            tree.data += `msg${numMsg}: .asciz "${this.#value}"\n`
            return { 'value': numMsg, 'size': this.#value.length, 'type': dataType.STRING }
        } else if (type1 == dataType.BOOLEAN) {
            let numTemp = tree.getTemp()
            tree.assembler += li(`t${numTemp}`, this.#value ? '1' : '0') + '\n'
            return { 'value': numTemp, 'type': type1 }
        } else if (type1 == dataType.DOUBLE) {
            let numTemp = tree.getTemp()
            tree.assembler += li(`t${numTemp}`, Math.round(this.#value)) + '\n'
            return { 'value': numTemp, 'type': dataType.INTEGER }
        } else if (type1 == dataType.CHAR) {
            let numTemp = tree.getTemp()
            tree.assembler += li(`t${numTemp}`, '0x' + this.#value.charCodeAt(0).toString(16)) + '\n'
            return { 'value': numTemp, 'type': dataType.CHAR }
        }
    }
}