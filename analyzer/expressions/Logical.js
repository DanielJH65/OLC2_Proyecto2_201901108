import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { Type, dataType } from "../symbol/Type.js";

export class Logical extends Instruction {
    #op1
    #op2
    #operation
    constructor(op1, op2, operation) {
        super(new Type(dataType.VOID), 0, 0)
        this.#op1 = op1
        this.#op2 = op2
        this.#operation = operation
    }

    interpret(tree, table) {
        const op1 = this.#op1?.interpret(tree, table)
        if (op1 instanceof Error) return op1
        const op2 = this.#op2?.interpret(tree, table)
        if (op2 instanceof Error) return op2
        switch (this.#operation) {
            case LogOperator.AND:
                return this.and(op1, op2)
            case LogOperator.OR:
                return this.or(op1, op2)
            case LogOperator.NOT:
                return this.not(op2)
            default:
                return new Errors("Semantic", `Operation not supported: ${this.#operation}`, this.getLine(), this.getColumn())
        }
    }

    and(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.BOOLEAN:
                switch (type2) {
                    case dataType.BOOLEAN:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 && op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} && ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} && ${type2}`, this.getLine(), this.getColumn())
        }
    }

    or(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.BOOLEAN:
                switch (type2) {
                    case dataType.BOOLEAN:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 || op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} || ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} || ${type2}`, this.getLine(), this.getColumn())
        }
    }

    not(op2) {
        let type2 = this.#op2.getType().getType()

        switch (type2) {
            case dataType.BOOLEAN:
                this.getType().setType(dataType.BOOLEAN)
                return !op2
            default:
                return new Errors("Semantic", `Operation not supported: !${type2}`, this.getLine(), this.getColumn())
        }
    }

    translate(tree, table) {
        let op1
        let op2
        switch (this.#operation) {
            case LogOperator.AND:
                op1 = this.#op1?.translate(tree, table)
                tree.assembler += `${op1.etiV}:\n`
                op2 = this.#op2?.translate(tree, table)
                return { 'etiV': op2.etiV, 'etiF': `${op1.etiF}:\n${op2.etiF}` }
            case LogOperator.OR:
                op1 = this.#op1?.translate(tree, table)
                tree.assembler += `${op1.etiF}:\n`
                op2 = this.#op2?.translate(tree, table)
                return { 'etiF': op2.etiF, 'etiV': `${op1.etiV}:\n${op2.etiV}` }
            case LogOperator.NOT:
                op2 = this.#op2?.translate(tree, table)
                return { 'etiF': op2.etiV, 'etiV': op2.etiF }
            default:
                return new Errors("Semantic", `Operation not supported: ${this.#operation}`, this.getLine(), this.getColumn())
        }
    }
}

export const LogOperator = Object.freeze({
    AND: '&&',
    OR: '||',
    NOT: '!'
})