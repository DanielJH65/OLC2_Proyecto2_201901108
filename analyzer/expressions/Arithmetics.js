import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { add, div, mul, rem, sub } from "../riscv/instructions.js";
import { Type, dataType } from "../symbol/Type.js";

export class Arithmetics extends Instruction {
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
            case Operators.ADD:
                return this.addition(op1, op2)
            case Operators.SUB:
                return this.subtraction(op1, op2)
            case Operators.MUL:
                return this.multiplication(op1, op2)
            case Operators.DIV:
                return this.division(op1, op2)
            case Operators.MOD:
                return this.mod(op1, op2)
            case Operators.DENIAL:
                return this.negation(op2)
            default:
                return new Errors("Semantic", `Operation not supported: ${this.#operation}`, this.getLine(), this.getColumn())
        }
    }

    addition(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.INTEGER)
                        return parseInt(op1) + parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.DOUBLE)
                        return parseInt(op1) + parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} + ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.DOUBLE)
                        return parseFloat(op1) + parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.DOUBLE)
                        return parseFloat(op1) + parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} + ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.STRING:
                switch (type2) {
                    case dataType.STRING:
                        this.getType().setType(dataType.STRING)
                        return op1 + op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} + ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} + ${type2}`, this.getLine(), this.getColumn())
        }
    }

    subtraction(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.INTEGER)
                        return parseInt(op1) - parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.DOUBLE)
                        return parseInt(op1) - parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} - ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.DOUBLE)
                        return parseFloat(op1) - parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.DOUBLE)
                        return parseFloat(op1) - parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} - ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} - ${type2}`, this.getLine(), this.getColumn())
        }
    }

    multiplication(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.INTEGER)
                        return parseInt(op1) * parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.DOUBLE)
                        return parseInt(op1) * parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} * ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.DOUBLE)
                        return parseFloat(op1) * parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.DOUBLE)
                        return parseFloat(op1) * parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} * ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} * ${type2}`, this.getLine(), this.getColumn())
        }
    }

    division(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.INTEGER)
                        return Math.trunc(parseInt(op1) / parseInt(op2))
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.DOUBLE)
                        return parseInt(op1) / parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} / ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.DOUBLE)
                        return parseFloat(op1) / parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.DOUBLE)
                        return parseFloat(op1) / parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} / ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} / ${type2}`, this.getLine(), this.getColumn())
        }
    }

    mod(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.INTEGER)
                        return parseInt(op1) % parseInt(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} % ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} % ${type2}`, this.getLine(), this.getColumn())
        }
    }

    negation(op2) {
        let type2 = this.#op2.getType().getType()

        switch (type2) {
            case dataType.INTEGER:
                this.getType().setType(dataType.INTEGER)
                return -parseInt(op2)
            case dataType.DOUBLE:
                this.getType().setType(dataType.DOUBLE)
                return -parseFloat(op2)
            default:
                return new Errors("Semantic", `Operation not supported: -${type2}`, this.getLine(), this.getColumn())
        }
    }

    translate(tree, table) {
        const op1 = this.#op1?.translate(tree, table)
        const op2 = this.#op2?.translate(tree, table)
        let t0 = 0
        switch (this.#operation) {
            case Operators.ADD:
                t0 = tree.getTempPrev()
                tree.assembler += add(`t${t0}`, `t${op1.value}`, `t${op2.value}`) + '\n'
                return { 'value': t0, 'type': this.#op1.getType().getType() }
            case Operators.SUB:
                t0 = tree.getTempPrev()
                tree.assembler += sub(`t${t0}`, `t${op1.value}`, `t${op2.value}`) + '\n'
                return { 'value': t0, 'type': this.#op1.getType().getType() }
            case Operators.MUL:
                t0 = tree.getTempPrev()
                tree.assembler += mul(`t${t0}`, `t${op1.value}`, `t${op2.value}`) + '\n'
                return { 'value': t0, 'type': this.#op1.getType().getType() }
            case Operators.DIV:
                t0 = tree.getTempPrev()
                tree.assembler += div(`t${t0}`, `t${op1.value}`, `t${op2.value}`) + '\n'
                return { 'value': t0, 'type': this.#op1.getType().getType() }
            case Operators.MOD:
                t0 = tree.getTempPrev()
                tree.assembler += rem(`t${t0}`, `t${op1.value}`, `t${op2.value}`) + '\n'
                return { 'value': t0, 'type': this.#op1.getType().getType() }
            case Operators.DENIAL:
                tree.assembler += sub(`t${op1.value}`, `zero`, `t${op2.value}`) + '\n'
                return { 'value': t0, 'type': this.#op1.getType().getType() }
            default:
                return new Errors("Semantic", `Operation not supported: ${this.#operation}`, this.getLine(), this.getColumn())
        }
    }
}

export const Operators = Object.freeze({
    ADD: '+',
    SUB: '-',
    MUL: '*',
    DIV: '/',
    MOD: '%',
    DENIAL: '--'
})