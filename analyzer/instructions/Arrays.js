import { Instruction } from "../abstract/Instruction.js";
import { dataType } from "../symbol/Type.js";
import { Symbol } from "../symbol/Symbol.js";
import { Errors } from "../exceptions/Errors.js";
import { SymbolReport } from "../symbol/SymbolReport.js";

export class Arrays extends Instruction {
    constructor(type, id, size, data, dimensions, row, column) {
        super(type, row, column);
        this.id = id;
        this.size = size;
        this.data = data;
        this.dimensions = dimensions;
        this.contador = 0;
    }

    interpret(tree, table) {
        if (this.size instanceof Instruction) this.size = this.size.interpret(tree, table);
        if (table.variableExists(this.id)) return new Errors("Semantic", `Variable ${this.id} already exists`, this.getLine(), this.getColumn());
        if (this.size <= 0 && this.size) return new Errors("Semantic", `Array size must be greater than 0`, this.getLine(), this.getColumn());
        let data2 = new Array(this.size)
        if (!this.data) {
            if (this.dimensions !== this.size.length) return new Errors("Semantic", `Array dimensions mismatch`, this.getLine(), this.getColumn());
            let temp = null
            let temp2 = null
            for (let i = this.dimensions - 1; i >= 0; i--) {
                temp2 = temp;
                let sizeTemp = this.size[i].interpret(tree, table)
                temp = new Array(sizeTemp)
                if (i === this.dimensions - 1) {
                    temp.fill(this.defaultValue())
                } else {
                    let temp3 = temp2.slice();
                    for (let j = 0; j < temp.length; j++) {
                        temp[j] = temp3.slice();
                    }
                }
            }
            data2 = temp;
        } else {
            data2 = new Array()
            if (this.data instanceof Array) {
                data2 = this.recursiva(this.data, tree, table);
                this.recursiva2(data2)
                if (this.contador !== this.dimensions) return new Errors("Semantic", `Array dimensions mismatch`, this.getLine(), this.getColumn());
            } else {
                let temp = this.data.interpret(tree, table);
                const tempString = JSON.stringify(temp);
                const copyOfTemp = JSON.parse(tempString);
                data2 = copyOfTemp;
                if (data2 instanceof Errors) return data2;
                if (this.getType().getType() != this.data.getType().getType()) return new Errors("Semantic", `Type mismatch in array assignment`, this.getLine(), this.getColumn());
                this.size = data2.length
            }
        }
        const sym = new Symbol(this.getType(), this.id, data2)
        table.setVariable(sym)
        tree.SymbolsReport.push(new SymbolReport(this.id, "Array", this.getType().getType(), data2, table.getName(), this.getLine(), this.getColumn()))
        return null
    }

    recursiva(data, tree, table) {
        let data2 = new Array()
        for (let element of data) {
            if (element instanceof Array) { data2.push(this.recursiva(element, tree, table)); continue }
            let value = element.interpret(tree, table);
            if (element.getType().getType() != this.getType().getType()) return new Errors("Semantic", `Type mismatch in array assignment`, this.getLine(), this.getColumn());
            data2.push(value);
        }
        return data2
    }

    recursiva2(data) {
        if (data instanceof Array) {
            this.recursiva2(data[0]);
            this.contador++;
        }
    }

    defaultValue() {
        switch (this.getType().getType()) {
            case dataType.INTEGER: return 0;
            case dataType.DOUBLE: return 0.0;
            case dataType.BOOLEAN: return false;
            case dataType.STRING: return "";
            case dataType.CHAR: return '\0';
            default: return null;
        }
    }
}