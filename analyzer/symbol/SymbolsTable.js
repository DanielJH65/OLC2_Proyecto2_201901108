export class SymbolsTable {
    #previousTable
    #table
    #name

    constructor(previousTable) {
        this.previousTable = previousTable
        this.table = new Map()
        this.functions = new Map()
        this.name = ""
    }

    getPreviousTable() {
        return this.previousTable
    }
    getTable() {
        return this.table
    }
    getName() {
        return this.name
    }
    getFunctions() {
        return this.functions
    }
    setPreviousTable(previousTable) {
        this.previousTable = previousTable
    }
    setTable(table) {
        this.table = table
    }
    setName(name) {
        this.name = name
    }
    variableExists(id) {
        let table = this
        while (table != null) {
            if (table.table.get(id) !== undefined) return true
            table = table.getPreviousTable()
        }
    }
    setVariable(variable) {
        this.table.set(variable.getId(), variable)
    }

    getVariable(id) {
        let table = this
        while (table != null) {
            if (table.table.get(id) !== undefined) return table.getTable().get(id)
            table = table.getPreviousTable()
        }
        return null
    }

    functionExists(id) {
        let table = this
        while (table != null) {
            if (table.functions.get(id) !== undefined) return true
            table = table.getPreviousTable()
        }
    }

    setFunction(function_) {
        this.functions.set(function_.name, function_)
    }

    getFunction(id) {
        let table = this
        while (table != null) {
            if (table.functions.get(id) !== undefined) return table.functions.get(id)
            table = table.getPreviousTable()
        }
        return null
    }
}