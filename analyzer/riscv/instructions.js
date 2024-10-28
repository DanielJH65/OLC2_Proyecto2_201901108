export const mv = (rd, rs1) => {
    return `mv ${rd}, ${rs1}`
}

export const li = (rd, imm) => {
    return `li ${rd}, ${imm}`
}

export const lw = (rd, imm, rs1) => {
    return `lw ${rd}, ${imm}(${rs1})`
}

export const sw = (rd, imm, rs1) => {
    return `sw ${rd}, ${imm}(${rs1})`
}

export const addi = (rd, rs1, imm) => {
    return `addi ${rd}, ${rs1}, ${imm}`
}

export const add = (rd, rs1, rs2) => {
    return `add ${rd}, ${rs1}, ${rs2}`
}

export const sub = (rd, rs1, rs2) => {
    return `sub ${rd}, ${rs1}, ${rs2}`
}

export const mul = (rd, rs1, rs2) => {
    return `mul ${rd}, ${rs1}, ${rs2}`
}

export const div = (rd, rs1, rs2) => {
    return `div ${rd}, ${rs1}, ${rs2}`
}

export const rem = (rd, rs1, rs2) => {
    return `rem ${rd}, ${rs1}, ${rs2}`
}

export const ecall = () => {
    return `ecall`
}