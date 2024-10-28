export class Symbol {
    #type
    #id
    #value
    constructor(type, id, value) {
        this.#type = type
        this.#id = id
        this.#value = value
    }
    getType() {
        return this.#type
    }
    getId() {
        return this.#id
    }
    getValue() {
        return this.#value
    }
    setId(id) {
        this.#id = id
    }
    setValue(value) {
        this.#value = value
    }
    setType(type) {
        this.#type = type
    }
}