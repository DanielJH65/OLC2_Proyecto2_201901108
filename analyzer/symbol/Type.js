export class Type {
    #type
    constructor(type) {
        this.#type = type
    }
    setType(type) {
        this.#type = type
    }
    getType() {
        return this.#type
    }
}

export const dataType = Object.freeze({
    "INTEGER": "int",
    "DOUBLE": "float",
    "CHAR": "char",
    "STRING": "string",
    "BOOLEAN": "boolean",
    "VOID": "void",
    "STRUCT": "struct",
    "NULL": "null"
})