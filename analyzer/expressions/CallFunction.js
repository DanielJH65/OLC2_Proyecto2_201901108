import { Instruction } from "../abstract/Instruction.js";
import { VarStatement } from "../instructions/VarStatement.js";
import { dataType, Type } from "../symbol/Type.js";
import { SymbolsTable } from "../symbol/SymbolsTable.js";
import { Errors } from "../exceptions/Errors.js";

export class CallFunction extends Instruction {
    constructor(id, params, row, column) {
        super(new Type(dataType.VOID), row, column);
        this.id = id;
        this.params = params;
    }

    interpret(tree, table) {
        let search = table.getFunction(this.id);
        if (search == null) return new Errors("Semantic", `Function ${this.id} does not exist`, this.getLine(), this.getColumn());
        let newTable = new SymbolsTable(table);
        newTable.setName("Function " + this.id);
        if (search.global) newTable.setPreviousTable(tree.getGlobalTable());
        if (this.params?.length !== search.params?.length) return new Errors("Semantic", `Function ${this.id} does not have the same number of parameters`, this.getLine(), this.getColumn());
        for (let i = 0; i < this.params?.length; i++) {
            let id = search.params[i].get("id")
            let value = this.params[i].interpret(tree, table);
            let type = search.params[i].get("type")

            if (value instanceof Errors) return value;
            if (this.params[i].getType().getType() != type.getType()) return new Errors("Semantic", `Parameter ${id} is not of type ${type.getType()}`, this.getLine(), this.getColumn());

            let paramStatement = new VarStatement(type, id, null, this.getLine(), this.getColumn());
            let result = paramStatement.interpret(tree, newTable);
            if (result instanceof Errors) return result;
            let variable = newTable.getVariable(id);
            if (variable == null) return new Errors("Semantic", `Variable ${id} does not exist`, this.getLine(), this.getColumn());
            variable.setValue(value);
        }

        let functionResult = search.interpret(tree, newTable);
        if (functionResult instanceof Errors) return functionResult;
        if (search.getType().getType() !== dataType.VOID) {
            if (functionResult == null) return new Errors("Semantic", `Function ${this.id} does not return a value`, this.getLine(), this.getColumn());
            this.getType().setType(search.getType().getType());
            return functionResult.finalValue;
        }
        return null;
    }

    translate(tree, table) {
        let func = table.getFunction(this.id)
        if (this.params && this.params?.length === func.params?.length) {
            for (let index = 0; index < this.params.length; index++) {
                let val = this.params[index].interpret(tree, table)
                tree.assembler += `li a${index + 1}, ${val}\n`
            }
        }
        tree.assembler += `jal ${this.id}\n`
    }
}