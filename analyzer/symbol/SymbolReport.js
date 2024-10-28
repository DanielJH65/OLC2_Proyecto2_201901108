export class SymbolReport {
    constructor(id, type, dataType, value, env, row, col) {
        this.id = id
        this.type = type
        this.dataType = dataType
        this.value = value
        this.env = env
        this.row = row
        this.col = col
    }
}