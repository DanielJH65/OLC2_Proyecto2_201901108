export class Instruction {
    #type
    #line
    #column

    constructor(type, line, column) {
        this.#type = type
        this.#line = line
        this.#column = column
    }

    getType() {
        return this.#type
    }
    getLine() {
        return this.#line
    }
    getColumn() {
        return this.#column
    }
    setType(type) {
        this.#type = type
    }
    setLine(line) {
        this.#line = line
    }
    setColumn(column) {
        this.#column = column
    }

    interpret(tree, table) { }
    translate(tree, table) { }
}