export class Errors {
    #errorType
    #desc
    #line
    #column
    constructor(errorType, desc, line, column) {
        this.#errorType = errorType
        this.#desc = desc
        this.#line = line
        this.#column = column
    }
    get errorType() {
        return this.#errorType
    }
    get desc() {
        return this.#desc
    }
    get line() {
        return this.#line
    }
    get column() {
        return this.#column
    }

    toString() {
        return `----Error ${this.#errorType} - ${this.#desc} - ${this.#line} - ${this.#column} ----`
    }
}