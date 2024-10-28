{{
import { Type, dataType } from "./symbol/Type.js"
import { Print } from "./instructions/Print.js"
import { VarStatement } from "./instructions/VarStatement.js"
import { VarAssignment } from "./instructions/VarAssignment.js"
import { If } from "./instructions/If.js"
import { While } from "./instructions/While.js"
import { Switch } from "./instructions/Switch.js"
import { Case } from "./instructions/Case.js"
import { Break } from "./instructions/Break.js"
import { Return } from "./instructions/Return.js"
import { Continue } from "./instructions/Continue.js"
import { For } from "./instructions/For.js"
import { ForEach } from "./instructions/ForEach.js"
import { Function } from "./instructions/Function.js"
import { Arrays } from "./instructions/Arrays.js"
import { ArrayAssignment } from "./instructions/ArrayAssignment.js"
import { Comentarios } from "./instructions/Comentarios.js"
import { Native } from "./expressions/Native.js"
import { Arithmetics, Operators } from "./expressions/Arithmetics.js"
import { Relational, RelOperators } from "./expressions/Relational.js"
import { Logical, LogOperator } from "./expressions/Logical.js"
import { VarAccess } from "./expressions/VarAccess.js"
import { CallFunction } from "./expressions/CallFunction.js"
import { ParseInt } from "./expressions/ParseInt.js"
import { ParseFloat } from "./expressions/ParseFloat.js"
import { ToString } from "./expressions/ToString.js"
import { ToLower } from "./expressions/ToLower.js"
import { ToUpper } from "./expressions/ToUpper.js"
import { TypeOf } from "./expressions/TypeOf.js"
import { IndexOf } from "./expressions/IndexOf.js"
import { Join } from "./expressions/Join.js"
import { Length } from "./expressions/Length.js"

function arithOperations(left, expand){
    const op1 = left
    const op2 = expand[2]
    const op = expand[0]

    return new Arithmetics(op1, op2, op)
}

function relOperations(left, expand){
    const op1 = left
    const op2 = expand[2]
    const op = expand[0]

    return new Relational(op1, op2, op)
}

function LogOperations(left, expand){
    const op1 = left
    const op2 = expand[2]
    const op = expand[0]

    return new Logical(op1, op2, op)
}
}}

S = INSTRUCTIONS

INSTRUCTIONS = ins:INSTRUCTION arr:INSTRUCTIONS     { arr.unshift(ins); return arr }
            / ins:INSTRUCTION                       { return new Array(ins) }

INSTRUCTION = PRINT
            / BREAK
            / CONTINUE
            / RETURN
            / IF
            / WHILE
            / SWITCH
            / FOR
            / FOR2
            / STATEMENT
            / COMENTARIOS
            / @ASSIGNMENT _";"_
            / @EXPRESSIONS _ ";"_

PRINT = _"System.out.println"_"(" exp:EXPRESSIONSPRINT ")"_";"_      { const {start:{line, column}} = location(); return new Print(exp, line, column)}

STATEMENT = type:TYPE _ id:ID _ "="_ exp:EXPRESSIONS _";"_      { const {start:{line, column}} = location(); return new VarStatement(type, id, exp, line, column) }
            / "var" _ id:ID _ "=" _ exp:EXPRESSIONS _ ";"_      { const {start:{line, column}} = location(); return new VarStatement(new Type(dataType.VOID), id, exp, line, column) }
            / type:TYPE _ id:ID _ "("_ par:PARAMS? _")" _ "{"_ ins:INSTRUCTIONS _"}"_ {const {start:{line, column}} = location(); return new Function(type, id, par, ins, line, column)}
            / type:TYPE _ cor:("["_"]") _ id:ID _ "=" _ "{"_ val:VALUES _"}"_";"_    { const {start:{line, column}} = location(); return new Arrays(type, id, val.length, val, cor.length, line, column); }
            / type:TYPE _ "["_"]" _ id:ID _ "=" _ "{"_ val:VALUES _"}"_";"_    { const {start:{line, column}} = location(); return new Arrays(type, id, val.length, val, 1, line, column); }
            / type:TYPE _ cor:("["_"]") _ id:ID _ "=" _ "new"_ TYPE _ exps:("["_ @EXPRESSIONS _"]") _";"_    { const {start:{line, column}} = location(); return new Arrays(type, id, exps, null, cor.length, line, column); }
            / type:TYPE _ "["_"]" _ id:ID _ "=" _ id2:ID _";"_    { const {start:{line, column}} = location(); return new Arrays(type, id, null, new VarAccess(id2, null, line, column), 1, line, column); }
            / type:TYPE _ id:ID _ ";"? _                         { const {start:{line, column}} = location(); return new VarStatement(type, id, undefined, line, column) }

PARAMS = type:TYPE _ id:ID _","_ params:PARAMS   { let param = new Map(); param.set("id", id); param.set("type", type); params.unshift(param); return params }
        / type:TYPE _ id:ID         { let param = new Map(); param.set("id", id); param.set("type", type); return [param] }

VALUES = exp:EXPRESSIONS _ "," _ val:VALUES     { val.unshift(exp); return val }
        / exp:EXPRESSIONS                       { return new Array(exp) }

TYPE = "int"        { return new Type(dataType.INTEGER) }
    / "float"       { return new Type(dataType.DOUBLE) }
    / "string"      { return new Type(dataType.STRING) }
    / "boolean"     { return new Type(dataType.BOOLEAN) }
    / "char"        { return new Type(dataType.CHAR) }
    / "void"        { return new Type(dataType.VOID) }

ASSIGNMENT = id:ID _ "=" _ exp:EXPRESSIONS _           { const {start:{line, column}} = location(); return new VarAssignment(id, exp, line, column)}
            / id:ID _ "+"_"=" _ exp:EXPRESSIONS _        { const {start:{line, column}} = location(); return new VarAssignment(id, new Arithmetics(new VarAccess(id, null, line, column), exp, "+"), line, column) }
            / id:ID _ "-"_"=" _ exp:EXPRESSIONS _       { const {start:{line, column}} = location(); return new VarAssignment(id, new Arithmetics(new VarAccess(id, null, line, column), exp, "-"), line, column)}
            / id:ID _ "+"_"+"_                                  { const {start:{line, column}} = location(); return new VarAssignment(id, new Arithmetics(new VarAccess(id, null, line, column), new Native(new Type(dataType.INTEGER), 1, line, column), "+"), line, column)}
            / id:ID _ "-"_"-"_                                  { const {start:{line, column}} = location(); return new VarAssignment(id, new Arithmetics(new VarAccess(id, null, line, column), new Native(new Type(dataType.INTEGER), 1, line, column), "-"), line, column)}
            / id:ID _ exps:("["_ @EXPRESSIONS _"]")+ _ "=" _ exp:EXPRESSIONS _  { const {start:{line, column}} = location(); return new ArrayAssignment(id, exp, exps, line, column) } 
            / id:ID _"."_ id2:ID _"="_ exp:EXPRESSIONS  { const {start:{line, column}} = location(); return new StructAssignment(id, id2, exp, line, column)}

IF = _"if"_"("_ exp:EXPRESSIONS _")"_"{"_ inst1:INSTRUCTIONS _"}"_ inst2:ELSE?  { const {start:{line, column}} = location(); return new If(exp, inst1, inst2 !== null  ? inst2 : null, line, column) }

ELSE = "else"_"{"_ inst1:INSTRUCTIONS _"}"_                     { return inst1 }
    / "else" _ if2:IF _                                         { return new Array(if2) }

SWITCH = _"switch"_"("_ exp:EXPRESSIONS _")"_"{" _ cases:CASESLIST _ def:DEFAULT? _ "}"_   { const {start:{line, column}} = location(); return new Switch(exp, cases, def, line, column) }

CASESLIST = cas:CASE casL:CASESLIST                             { casL.unshift(cas); return casL }
            / cas:CASE                                          { return new Array(cas) }

CASE = "case"_ exp:EXPRESSIONS _":"_ ins:INSTRUCTIONS? _        { const {start:{line, column}} = location(); return new Case(exp, ins, line, column) }

DEFAULT = "default"_":"_ ins:INSTRUCTIONS _                     { const {start:{line, column}} = location(); return new Case(null, ins, line, column) }

WHILE = _"while"_"("_ exp:EXPRESSIONS _")"_"{"_ ins:INSTRUCTIONS _"}"_ { const {start:{line, column}} = location(); return new While(exp, ins, line, column) }

BREAK = "break"_";"_      { const {start:{line, column}} = location(); return new Break(line, column) } 

CONTINUE = "continue"_";"_ { const {start:{line, column}} = location(); return new Continue(line, column) }

RETURN = "return" _ exp:EXPRESSIONS? _ ";"_ { const {start:{line, column}} = location(); return new Return(exp, line, column) }

FOR = _"for"_"("_ stat:STATEMENT _ exp:EXPRESSIONS _";"_ assig:ASSIGNMENT _")"_"{"_ ins:INSTRUCTIONS _"}"_ { const {start:{line, column}} = location(); return new For(stat, exp, assig, ins, line, column) }

FOR2 = _"for"_ "("_ stat:STATEMENT _ ":" _ id:ID _")"_"{"_ ins:INSTRUCTIONS _"}"_     { const {start:{line, column}} = location(); return new ForEach(stat, id, ins, line, column) }

EXPRESSIONSPRINT = exp:EXPRESSIONS _ "," _ arr:EXPRESSIONSPRINT { arr.unshift(exp); return arr }
                / exp:EXPRESSIONS                       { return new Array(exp) }

EXPRESSIONS = PREC7

PREC7 = op1:PREC6 _ expanded:(("||") _ PREC6)* { const {start:{line, column}} = location(); const res = expanded.reduce(LogOperations, op1) 
    res.setLine(line); res.setColumn(column); return res}

PREC6 = op1:PREC5 _ expanded:(("&&") _ PREC5)* { const {start:{line, column}} = location(); const res = expanded.reduce(LogOperations, op1) 
    res.setLine(line); res.setColumn(column); return res}

PREC5 = op1:PREC4 _ expanded:(("==" / "!=") _ PREC4)* { const {start:{line, column}} = location(); const res = expanded.reduce(relOperations, op1) 
    res.setLine(line); res.setColumn(column); return res}

PREC4 = op1:PREC3 _ expanded:((">=" / ">" / "<=" / "<") _ PREC3)* { const {start:{line, column}} = location(); const res = expanded.reduce(relOperations, op1) 
    res.setLine(line); res.setColumn(column); return res}

PREC3 = op1:PREC2 _ expanded:(("+" / "-") _ PREC2)* { const {start:{line, column}} = location(); const res = expanded.reduce(arithOperations, op1) 
    res.setLine(line); res.setColumn(column); return res}

PREC2 = op1:PREC1 _ expanded:(("*" / "/" / "%") _ PREC1)* { const {start:{line, column}} = location(); const res = expanded.reduce(arithOperations, op1) 
    res.setLine(line); res.setColumn(column); return res}

PREC1 = @NATIVOS _ 

NATIVOS = "(" _ @EXPRESSIONS _ ")"
        /("-") _ op1:PREC2 { const {start:{line, column}} = location(); const res = new Arithmetics(null, op1, Operators.DENIAL, line, column)
                                res.setLine(line); res.setColumn(column); return res}
        /("!") _ op1:PREC2 { const {start:{line, column}} = location(); const res = new Logical(null, op1, LogOperator.NOT, line, column)
                                res.setLine(line); res.setColumn(column); return res}
        / STRING
        / CHAR
        / DOUBLE
        / INTEGER
        / BOOLEAN
        / "parseInt"_"("_ exp:EXPRESSIONS _")"       { const {start:{line, column}} = location(); return new ParseInt(exp, line, column)}  
        / "parsefloat"_"("_ exp:EXPRESSIONS _")"     { const {start:{line, column}} = location(); return new ParseFloat(exp, line, column)}  
        / "toString"_"("_ exp:EXPRESSIONS _")"       { const {start:{line, column}} = location(); return new ToString(exp, line, column)}  
        / "toLowerCase"_"("_ exp:EXPRESSIONS _")"    { const {start:{line, column}} = location(); return new ToLower(exp, line, column)}  
        / "toUpperCase"_"("_ exp:EXPRESSIONS _")"    { const {start:{line, column}} = location(); return new ToUpper(exp, line, column)}  
        / "typeof"_ exp:EXPRESSIONS _                { const {start:{line, column}} = location(); return new TypeOf(exp, line, column)}  
        / id:ID _ "("_ par:PARAMSCALL? _")"_         { const {start:{line, column}} = location(); return new CallFunction(id, par, line, column)}
        / id:ID exps:("["_ @EXPRESSIONS _"]")+       { const {start:{line, column}} = location(); return new VarAccess(id, exps, line, column)}
        / id:ID "."_"indexOf("_ exp:EXPRESSIONS _")" { const {start:{line, column}} = location(); return new IndexOf(id, exp, line, column)}
        / id:ID "."_"join("_")"                      { const {start:{line, column}} = location(); return new Join(id, line, column)}
        / id:ID "."_"length"                         { const {start:{line, column}} = location(); return new Length(id, line, column)}
        / id:ID            { const {start:{line, column}} = location(); return new VarAccess(id, null, line, column)}

PARAMSCALL = exp:EXPRESSIONS _ "," _ par:PARAMSCALL { par.unshift(exp); return par }
        / exp:EXPRESSIONS                           { return new Array(exp) }

STRING = "\"" chars:STRINGS* "\"" { const {start:{line, column}} = location(); 
    return new Native(new Type(dataType.STRING), chars.join(""), line, column) }

STRINGS = [^"]

CHAR = "\'" char:CHARS "\'" { const {start:{line, column}} = location(); 
    return new Native(new Type(dataType.CHAR), char[0], line, column) }

CHARS = [^']

INTEGER = int:[0-9]+ { const {start:{line, column}} = location(); 
    return new Native(new Type(dataType.INTEGER), parseInt(int.join(""), 10), line, column) }

DOUBLE = int:[0-9]+ "\." double:[0-9]+ { const {start:{line, column}} = location(); 
    return new Native(new Type(dataType.DOUBLE), parseFloat(int.join("") + "."+ double.join(""), 10), line, column) }

BOOLEAN = bool:("true"/"false") { const {start:{line, column}} = location()
    return new Native(new Type(dataType.BOOLEAN), bool === "true", line, column) }

ID = [a-zA-Z_][a-zA-Z0-9_]* {return text() }

_ "whitespace" = ([ \t\n\r])*

COMENTARIOS = _ "//" comment:((![\n] .)*) _           { return new Comentarios(true, text().replace("//","#").replace("\n",""), 0, 0) }
            / _ "/*" comment:((!("*/") .)*) "*/" _    { return new Comentarios(false, text(), 0, 0) }