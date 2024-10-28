import { Instruction } from "../abstract/Instruction.js";
import { Errors } from "../exceptions/Errors.js";
import { dataType, Type } from "../symbol/Type.js";

export class ArrayAssignment extends Instruction {
    constructor(id, expression, position, row, column) {
        super(new Type(dataType.VOID), row, column);
        this.id = id;
        this.expression = expression;
        this.position = position;
    }

    interpret(tree, table) {
        let variable = table.getVariable(this.id)
        let temp = this.expression.interpret(tree, table)
        this.getType().setType(this.expression.getType().getType())
        if (this.expression.getType().getType() !== this.getType().getType()) {
            return new Errors("Semantic", `Type mismatch, expected ${this.getType().getType()} but got ${this.expression.getType().getType()}`, this.getLine(), this.getColumn())
        }
        if (variable === null) return new Errors("Semantic", `Variable ${this.id} does not exists`, this.getLine(), this.getColumn());
        /*for (let element = 0; element < this.position.length; element++) {
            let value = this.position[element].interpret(tree, table);
            if (value instanceof Error) return new Errors("Semantic", `Index out of range`, this.getLine(), this.getColumn());
            if (element === 0) {
                if (value >= variable.getValue().length) return new Errors("Semantic", `Index out of range`, this.getLine(), this.getColumn());
                variable = variable.getValue()
            } else {
                if (value >= variable.length) return new Errors("Semantic", "Index out of range", this.getLine(), this.getColumn());
                variable = variable
            }
        }*/
        this.assignment(tree, table, variable.getValue(), this.position, temp)
        return null
    }

    assignment(tree, table, data, position, value) {
        if (position.length === 1) {
            const index = position[0].interpret(tree, table);
            if (index >= 0 && index < data.length) {
                data[index] = value;
            } else {
                return new Errors("Semantic", "Index out of range", this.getLine(), this.getColumn());
            }
        } else {
            const [currentIndex, ...remainingPositions] = position;
            if (currentIndex.interpret(tree, table) >= 0 && currentIndex.interpret(tree, table) < data.length) {
                this.assignment(tree, table, data[currentIndex.interpret(tree, table)], remainingPositions, value)
            } else {
                return new Errors("Semantic", "Index out of range", this.getLine(), this.getColumn());
            }
        }
        return data
    }
}