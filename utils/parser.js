import { parse, SyntaxError } from "../analyzer/analyzer.js"
import { Tree } from "../analyzer/symbol/Tree.js"
import { SymbolsTable } from "../analyzer/symbol/SymbolsTable.js"
import { Errors } from "../analyzer/exceptions/Errors.js"
import { Function } from "../analyzer/instructions/Function.js"
import { SymbolReport } from "../analyzer/symbol/SymbolReport.js"

let errors = new Array()
let symbols = new Array()
let code = ""

export const analyze = () => {
    clearErrors()
    const input = window.editor.getValue()
    try {
        const tree = parse(input)
        const ast = new Tree(tree)
        const globalTable = new SymbolsTable(null)
        globalTable.setName("Global")
        ast.setGlobalTable(globalTable)
        for (let function_ of ast.getInstructions()) {
            function_.global = true;
            if (function_ instanceof Function) {
                if (globalTable.getFunction(function_.name) !== null) ast.getErrors().push(new Errors('Semantic', `Function ${function_.name} already exists`, function_.getLine(), function_.getColumn()));
                globalTable.setFunction(function_)
                ast.SymbolsReport.push(new SymbolReport(function_.name, "Función", function_.getType().getType(), null, globalTable.getName(), function_.getLine(), function_.getColumn()))
            }
        }
        ast.getInstructions().forEach(instruction => {
            if (!(instruction instanceof Function)) {
                let res = instruction.interpret(ast, ast.getGlobalTable())
                if (res instanceof Errors) ast.getErrors().push(res)
            }
        })
        for (let instruction of ast.getInstructions()) {
            instruction.translate(ast, ast.getGlobalTable())
        }
        code = '.data\n'
        code += ast.data + '\n'
        code += '.text\n.globl main\nmain:\n'
        code += ast.assembler
        code += 'li a7, 10\n'
        code += 'ecall\n\n'
        code += ast.functions
        errors = ast.getErrors()
        symbols = ast.SymbolsReport
        document.getElementById("console").value = ast.getConsole()
        console.log(code)
        //generateAsm()
    } catch (error) {
        if (error instanceof SyntaxError) {
            if (isLexicalError(error)) {
                errors.push(new Errors("Lexical", error.message, 0, 0))
            } else {
                errors.push(new Errors("Syntax", error.message, 0, 0))
            }
        } else {
            errors.push(new Errors("Semantic", error.message, 0, 0))
        }
    } finally {
        let salida = ""
        for (let err of errors) salida += err.toString() + "\n"
        document.getElementById("console").value = document.getElementById("console").value + "\n" + salida
    }
}

const generateAsm = async () => {
    const blob = new Blob([code], { type: "text/asm" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Salida.asm";
    document.body.appendChild(link);
    link.click()
}

export const generateErrors = async () => {
    let salida;
    salida = "<!DOCTYPE html>\n" + "<html lang=\"es\">\n" + "<head>\n" + "    <meta charset=\"UTF-8\">\n" + "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" + "    <link href=\"https://bootswatch.com/4/superhero/bootstrap.min.css\" rel=\"stylesheet\" type=\"text/css\">\n" + "    <title>Reporte de Errores</title>\n" + "</head>\n" + "<body style=\"background: linear-gradient(to right, #141e30, #243b55);\">\n" + "    <nav class=\"navbar navbar-expand-lg navbar-dark bg-secondary\">\n" + "        <a class=\"navbar-brand\" href=\"#\">Proyecto 1 - Organizaci\u00f3n de Lenguajes y Compiladores 1</a>\n" + "        <a class=\"navbar-brand\" href=\"#\">Walter Daniel Jimenez Hernandez 201901108</a>\n" + "    </nav>\n";
    salida += "<div class=\"jumbotron my-4 mx-4\">\n";
    salida += "<br><center><h3>Listado de Errores</h3></center><br>\n";
    salida += "<table class=\"table table-hover\">\n";
    salida += "<thead>\n";
    salida += "<tr>\n";
    salida += "<th scope=\"col\">Tipo</th>\n";
    salida += "<th scope=\"col\">Descripción</th>\n";
    salida += "<th scope=\"col\">Linea</th>\n";
    salida += "<th scope=\"col\">Columna</th>\n";
    salida += "</tr>\n";
    salida += "</thead>\n";
    salida += "<tbody>\n";

    for (let er of errors) {
        salida += "<tr class=\"table-danger\">\n";
        salida += "<td>" + er.errorType + "</td>\n";
        salida += "<td>" + er.desc + "</td>\n";
        salida += "<td>" + er.line + "</td>\n";
        salida += "<td>" + er.column + "</td>\n";
    }

    salida += "</tbody></table></div></html>\n";

    /*const file = await window.showSaveFilePicker({
        suggestedName: "Errores.html",
        types: [{
            description: "HTML File",
            accept: {
                "text/html": [".html"]
            }
        }]
    });
    const writer = await file.createWritable();
    writer.write(salida);
    await writer.close();*/
    const blob = new Blob([salida], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Errores.html";
    document.body.appendChild(link);
    link.click()
}

export const generateSymbols = () => {

    let salida = "<!DOCTYPE html>\n" + "<html lang=\"es\">\n" + "<head>\n" + "    <meta charset=\"UTF-8\">\n" + "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n"
        + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
        + "    <link href=\"https://bootswatch.com/4/superhero/bootstrap.min.css\" rel=\"stylesheet\" type=\"text/css\">\n"
        + "    <title>Reporte de Simbolos</title>\n" + "</head>\n" + "<body style=\"background: linear-gradient(to right, #141e30, #243b55);\">\n"
        + "    <nav class=\"navbar navbar-expand-lg navbar-dark bg-secondary\">\n"
        + "        <a class=\"navbar-brand\" href=\"#\">Proyecto 1 - Organizaci\u00f3n de Lenguajes y Compiladores 1</a>\n"
        + "        <a class=\"navbar-brand\" href=\"#\">Walter Daniel Jimenez Hernandez 201901108</a>\n" + "    </nav>\n";
    salida += "<div class=\"jumbotron my-4 mx-4\">\n";
    salida += "<br><center><h3>Listado de Simbolos</h3></center><br>\n";
    salida += "<table class=\"table table-hover\">\n";
    salida += "<thead>\n";
    salida += "<tr>\n";
    salida += "<th scope=\"col\">Id</th>\n";
    salida += "<th scope=\"col\">Tipo</th>\n";
    salida += "<th scope=\"col\">Tipo de dato</th>\n";
    salida += "<th scope=\"col\">Valor</th>\n";
    salida += "<th scope=\"col\">Entorno</th>\n";
    salida += "<th scope=\"col\">Linea</th>\n";
    salida += "<th scope=\"col\">Columna</th>\n";
    salida += "</tr>\n";
    salida += "</thead>\n";
    salida += "<tbody>\n";

    for (let sym of symbols) {
        salida += "<tr class=\"table-primary\">\n";
        salida += "<td>" + sym.id + "</td>\n";
        salida += "<td>" + sym.type + "</td>\n";
        salida += "<td>" + sym.dataType + "</td>\n";
        salida += "<td>" + sym.value + "</td>\n";
        salida += "<td>" + sym.env + "</td>\n";
        salida += "<td>" + sym.row + "</td>\n";
        salida += "<td>" + sym.col + "</td>\n";
    }

    salida += "</tbody></table></div></html>\n";
    const blob = new Blob([salida], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Symbols.html";
    document.body.appendChild(link);
    link.click()
}

export const clearErrors = () => {
    errors = []
    document.getElementById("console").value = ""
}

const isLexicalError = (error) => {
    const validIdentifier = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    const validInteger = /^[0-9]+$/;
    const validRegister = /^[a-zA-Z][0-9]+$/;
    const validCharacter = /^[a-zA-Z0-9_$,\[\]#"]$/;
    if (error.found) {
        if (!validIdentifier.test(error.found) &&
            !validInteger.test(error.found) &&
            !validRegister.test(error.found) &&
            !validCharacter.test(error.found)) {
            return true; // Error léxico
        }
    }
    return false; // Error Semántico
}