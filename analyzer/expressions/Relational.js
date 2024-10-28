import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { Type, dataType } from "../symbol/Type.js";

export class Relational extends Instruction {
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
            case RelOperators.GREATER:
                return this.greater(op1, op2)
            case RelOperators.GREATER_EQUAL:
                return this.greaterEqual(op1, op2)
            case RelOperators.LESS:
                return this.less(op1, op2)
            case RelOperators.LESS_EQUAL:
                return this.lessEqual(op1, op2)
            case RelOperators.EQUAL:
                return this.equal(op1, op2)
            case RelOperators.NOT_EQUAL:
                return this.notEqual(op1, op2)
            default:
                return new Errors("Semantic", `Operation not supported: ${this.#operation}`, this.getLine(), this.getColumn())
        }
    }

    greater(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) > parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) > parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} > ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) > parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) > parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} > ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.CHAR:
                switch (type2) {
                    case dataType.CHAR:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 > op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} > ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} > ${type2}`, this.getLine(), this.getColumn())
        }
    }

    greaterEqual(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) >= parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) >= parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} >= ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) >= parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) >= parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} >= ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.CHAR:
                switch (type2) {
                    case dataType.CHAR:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 >= op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} >= ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} >= ${type2}`, this.getLine(), this.getColumn())
        }
    }

    less(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) < parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) < parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} < ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) < parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) < parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} < ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.CHAR:
                switch (type2) {
                    case dataType.CHAR:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 > op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} < ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} < ${type2}`, this.getLine(), this.getColumn())
        }
    }

    lessEqual(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) <= parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) <= parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} <= ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) <= parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) <= parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} <= ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.CHAR:
                switch (type2) {
                    case dataType.CHAR:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 <= op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} <= ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} <= ${type2}`, this.getLine(), this.getColumn())
        }
    }

    equal(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) === parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) === parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} == ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) === parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) === parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} == ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.CHAR:
                switch (type2) {
                    case dataType.CHAR:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 === op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} == ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.STRING:
                switch (type2) {
                    case dataType.STRING:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 === op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} == ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.BOOLEAN:
                switch (type2) {
                    case dataType.BOOLEAN:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 === op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} == ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} == ${type2}`, this.getLine(), this.getColumn())
        }
    }

    notEqual(op1, op2) {
        let type1 = this.#op1.getType().getType()
        let type2 = this.#op2.getType().getType()

        switch (type1) {
            case dataType.INTEGER:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) !== parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseInt(op1) !== parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} != ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.DOUBLE:
                switch (type2) {
                    case dataType.INTEGER:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) !== parseInt(op2)
                    case dataType.DOUBLE:
                        this.getType().setType(dataType.BOOLEAN)
                        return parseFloat(op1) !== parseFloat(op2)
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} != ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.CHAR:
                switch (type2) {
                    case dataType.CHAR:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 !== op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} != ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.STRING:
                switch (type2) {
                    case dataType.STRING:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 !== op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} != ${type2}`, this.getLine(), this.getColumn())
                }
            case dataType.BOOLEAN:
                switch (type2) {
                    case dataType.BOOLEAN:
                        this.getType().setType(dataType.BOOLEAN)
                        return op1 !== op2
                    default:
                        return new Errors("Semantic", `Operation not supported: ${type1} != ${type2}`, this.getLine(), this.getColumn())
                }
            default:
                return new Errors("Semantic", `Operation not supported: ${type1} != ${type2}`, this.getLine(), this.getColumn())
        }
    }

    translate(tree, table) {
        const op1 = this.#op1?.translate(tree, table)
        const op2 = this.#op2?.translate(tree, table)
        let etiV = `L${tree.getLabel()}`
        let etiF = `L${tree.getLabel()}`
        switch (this.#operation) {
            case RelOperators.GREATER:
                tree.assembler += `bgt t${op1.value}, t${op2.value}, ${etiV}\n`
                tree.assembler += `j ${etiF}\n`
                return { etiV, etiF }
            case RelOperators.GREATER_EQUAL:
                tree.assembler += `bge t${op1.value}, t${op2.value}, ${etiV}\n`
                tree.assembler += `j ${etiF}\n`
                return { etiV, etiF }
            case RelOperators.LESS:
                tree.assembler += `blt t${op1.value}, t${op2.value}, ${etiV}\n`
                tree.assembler += `j ${etiF}\n`
                return { etiV, etiF }
            case RelOperators.LESS_EQUAL:
                tree.assembler += `ble t${op1.value}, t${op2.value}, ${etiV}\n`
                tree.assembler += `j ${etiF}\n`
                return { etiV, etiF }
            case RelOperators.EQUAL:
                tree.assembler += `beq t${op1.value}, t${op2.value}, ${etiV}\n`
                tree.assembler += `j ${etiF}\n`
                return { etiV, etiF }
            case RelOperators.NOT_EQUAL:
                tree.assembler += `bne t${op1.value}, t${op2.value}, ${etiV}\n`
                tree.assembler += `j ${etiF}\n`
                return { etiV, etiF }
            default:
                return new Errors("Semantic", `Operation not supported: ${this.#operation}`, this.getLine(), this.getColumn())
        }
    }
}

export const RelOperators = Object.freeze({
    GREATER: '>',
    GREATER_EQUAL: '>=',
    LESS: '<',
    LESS_EQUAL: '<=',
    EQUAL: '==',
    NOT_EQUAL: '!=',
})