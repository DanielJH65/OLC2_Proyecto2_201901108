import { Instruction } from "../abstract/Instruction.js"
import { Errors } from "../exceptions/Errors.js"
import { ecall, li, mv } from "../riscv/instructions.js"
import { Type, dataType } from "../symbol/Type.js"


export class Print extends Instruction {
    constructor(expressions, line, column) {
        super(new Type(dataType.VOID), line, column)
        this.expressions = expressions
    }

    interpret(tree, table) {
        for (let expression of this.expressions) {
            let value = expression.interpret(tree, table)
            if (value instanceof Errors) {
                tree.setConsole(tree.getConsole() + "null\n")
                return value
            }
            if (expression.getType().getType() === dataType.STRING) {
                value = value.toString()
                value = value.replaceAll("\\'", "'");
                value = value.replaceAll('\\"', '"');
                value = value.replaceAll("\\t", "\t");
                value = value.replaceAll("\\n", "\n");
                value = value.replaceAll("\\\\", "\\");
            }
            tree.setConsole(tree.getConsole() + value?.toString() + " ")
        }
        tree.setConsole(tree.getConsole() + "\n")
        return null
    }

    translate(tree, table) {
        for (let expression of this.expressions) {
            let value = expression.translate(tree, table)
            if (value.type == dataType.STRING) {
                tree.assembler += `la a1, msg${value.value}\n`
                tree.assembler += li('a2', value.size) + '\n'
                tree.assembler += li('a0', 1) + '\n'
                tree.assembler += li('a7', 64) + '\n'
                tree.assembler += ecall() + '\n'
            } else if (value.type == dataType.INTEGER || value.type == dataType.DOUBLE || value.type == dataType.BOOLEAN) {
                tree.assembler += mv('a0', `t${value.value}`) + '\n'
                tree.assembler += li('a7', 1) + '\n'
                tree.assembler += ecall() + '\n'
            } else if (value.type == dataType.CHAR) {
                tree.assembler += mv('a0', `t${value.value}`) + '\n'
                tree.assembler += li('a7', 11) + '\n'
                tree.assembler += ecall() + '\n'
            }
            tree.assembler += li('a0', 0xa) + '\n'
            tree.assembler += li('a7', 11) + '\n'
            tree.assembler += ecall() + '\n'
        }
    }
}