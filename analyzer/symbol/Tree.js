import { SymbolsTable } from "./SymbolsTable.js"

export class Tree {
    #instructions
    #console
    #globalTable
    #errors
    constructor(instructions) {
        this.#instructions = instructions
        this.#console = ""
        this.#globalTable = new SymbolsTable(null)
        this.#errors = new Array()
        this.structs = new Array()
        this.SymbolsReport = new Array()
        this.temp = 0
        this.label = 0
        this.msg = 0
        this.cont = 0
        this.data = ""
        this.assembler = ""
        this.functions = ""
        this.display = new Array()
    }
    getInstructions() {
        return this.#instructions
    }
    getConsole() {
        return this.#console
    }
    getGlobalTable() {
        return this.#globalTable
    }
    getErrors() {
        return this.#errors
    }
    setInstructions(instructions) {
        this.#instructions = instructions
    }
    setConsole(console) {
        this.#console = console
    }
    setGlobalTable(globalTable) {
        this.#globalTable = globalTable
    }
    setErrors(errors) {
        this.#errors = errors
    }
    structExist(id) {
        return this.structs.find(struct => struct.id === id)
    }
    setStruct(struct) {
        this.structs.push(struct)
    }
    getStruct(id) {
        return this.structs.find(struct => struct.id === id)
    }
    getTemp() {
        if (this.temp == 7) {
            this.temp = 0
        }
        return this.temp++
    }
    getTempPrev() {
        if (this.temp == 0) {
            this.temp = 7
        }
        if (this.temp == 1) {
            this.temp = 0
            return 6
        }
        this.temp -= 1
        return this.temp - 1
    }
    getLabel() {
        return this.label++
    }
    getMsg() {
        return this.msg++
    }
    getCont() {
        return this.cont++
    }
}