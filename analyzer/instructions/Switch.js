import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { Type, dataType } from "../symbol/Type.js"
import { Break } from "./Break.js";
import { SymbolsTable } from "../symbol/SymbolsTable.js";

export class Switch extends Instruction {
    constructor(condition, cases, caseDef, row, column) {
        super(new Type(dataType.VOID), row, column);
        this.condition = condition;
        this.cases = cases;
        this.caseDef = caseDef;
    }

    interpret(tree, table) {
        const cond = this.condition.interpret(tree, table);
        if (cond instanceof Errors) return cond;
        let newTable = new SymbolsTable(table);
        newTable.setName("Switch" + this.getLine())
        let isCase = false;
        let validate = false;
        for (let element of this.cases) {
            let expression = element.getExpression(tree, table)
            if (expression instanceof Errors) return expression;
            if (this.condition.getType().getType() != element.case.getType().getType()) return new Errors("Semantic", `Type mismatch, expected ${this.condition.getType().getType()} but got ${element.case.getType().getType()}`, element.getLine(), element.getColumn())
            if (cond === expression || validate) {
                const result = element.interpret(tree, newTable);
                if (result instanceof Errors) { tree.getErrors().push(result) }
                if (result instanceof Break) { isCase = true; break }
                validate = true;
            }
        };
        if (this.caseDef && !isCase) {
            const result = this.caseDef.interpret(tree, newTable);
            if (result instanceof Errors) tree.getErrors().push(result);
        }
    }

    translate(tree, table) {
        let exp = this.condition.translate(tree, table)
        let temp = tree.getTemp()
        tree.getTempPrev()
        let variable = `switch${tree.getLabel()}`
        tree.data += `${variable}: .word 0\n`
        tree.assembler += `la t${temp}, ${variable}\n`
        tree.assembler += `sw t${exp.value}, 0(t${temp})\n`
        let lInit = `L${tree.getLabel()}`
        let lExit = `L${tree.getLabel()}`
        let data = new Map()
        data.set("etiInit", lInit)
        data.set("etiExit", lExit)
        data.set("var", variable)
        tree.display.push(data)
        tree.assembler += `${lInit}:\n`
        for (let case1 of this.cases) {
            case1.translate(tree, table)
        }
        if (this.caseDef) this.caseDef.translate(tree, table)
        tree.assembler += `${lExit}:\n`
        tree.display.pop()
    }
}