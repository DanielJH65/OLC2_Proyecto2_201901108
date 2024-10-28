import { Instruction } from "../abstract/Instruction.js";
import { dataType } from "../symbol/Type.js";
import { Symbol } from "../symbol/Symbol.js"
import { Errors } from "../exceptions/Errors.js"
import { Native } from "../expressions/Native.js";
import { SymbolReport } from "../symbol/SymbolReport.js";

export class VarStatement extends Instruction {
    constructor(type, id, expression, line, column) {
        super(type, line, column)
        this.id = id
        this.expression = expression
    }

    interpret(tree, table) {
        if (table.variableExists(this.id)) return new Errors("Semantic", `Variable ${this.id} already exists`, this.getLine(), this.getColumn())
        let value = this.expression?.interpret(tree, table)
        if (value instanceof Errors) {
            const sym = new Symbol(this.getType(), this.id, null)
            table.setVariable(sym)
            tree.SymbolsReport.push(new SymbolReport(this.id, "Variable", this.getType().getType(), value, table.getName(), this.getLine(), this.getColumn()))
            return value
        }
        if (value === undefined) {
            this.expression = new Native(this.getType(), null, this.getLine(), this.getColumn())
            value = this.expression?.interpret(tree, table)
        }
        if (this.getType().getType() == dataType.VOID) this.getType().setType(this.expression.getType().getType())
        if (this.getType().getType() == dataType.DOUBLE && this.expression?.getType().getType() == dataType.INTEGER) this.expression.getType().setType(dataType.DOUBLE)
        if (this.getType().getType() != this.expression?.getType().getType()) return new Errors("Semantic", `Type mismatch in variable declaration`, this.getLine(), this.getColumn())
        const sym = new Symbol(this.getType(), this.id, value)
        table.setVariable(sym)
        tree.SymbolsReport.push(new SymbolReport(this.id, "Variable", this.getType().getType(), value, table.getName(), this.getLine(), this.getColumn()))
        return null
    }

    defaultValue() {
        switch (this.getType().getType()) {
            case dataType.INTEGER: return 0;
            case dataType.DOUBLE: return 0.0;
            case dataType.BOOLEAN: return true;
            case dataType.STRING: return "";
            case dataType.CHAR: return '\0';
            default: return null;
        }
    }

    translate(tree, table) {
        let exp = this.expression?.translate(tree, table)
        tree.data += `${this.id}: .word 0\n`
        if (exp && exp.type != dataType.STRING) {
            let temp = tree.getTemp()
            tree.getTempPrev()
            tree.assembler += `la t${temp}, ${this.id}\n`
            tree.assembler += `sw t${exp.value}, 0(t${temp})\n`
        }
    }
}