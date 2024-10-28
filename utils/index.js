import { analyze, generateErrors, generateSymbols } from "./parser.js"

document.querySelector("#abrirArchivo").addEventListener("click", () => {
    document.querySelector("#inputAbrirArchivo").click()
})

document.querySelector("#inputAbrirArchivo").addEventListener("change", (e) => {
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.onload = (e) => {
        let contents = e.target.result
        window.editor.setValue(contents)
    }
    reader.readAsText(file)
}, false)

document.querySelector("#nuevoArchivo").addEventListener("click", () => {
    window.editor.setValue("")
})

document.querySelector("#guardarArchivo").addEventListener("click", () => {
    const blob = new Blob([window.editor.getValue()], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Archivo.oak";
    document.body.appendChild(link);
    link.click()
})

document.querySelector("#execute").addEventListener("click", () => {
    analyze()
})

document.querySelector("#reporteErrores").addEventListener("click", () => {
    generateErrors()
})

document.querySelector("#reporteSimbolos").addEventListener("click", () => {
    generateSymbols()
})