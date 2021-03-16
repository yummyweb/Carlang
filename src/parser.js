import parseVar from "./variables.js"
import parseLog from "./log.js"
import { FUNCTION, RETURN, ASSIGNMENT, END } from './utils/tokenTypes.js'

const AST = () => ({
    type: "File",
    errors: [],
    program: {
        type: "Program",
        sourceType: "module",
        interpreter: null,
        body: [],
        directives: [],
    },
    comments: [],
})

const FunctionDeclaration = (token) => ({
    type: "FunctionDeclaration",
    id: {
        type: "Identifier",
        name: token
    },
    params: [],
    body: {},
})

const BlockStatement = () => ({
    type: "BlockStatement",
    body: [],
})

const ExpressionStatement = (callee) => ({
    type: "ExpressionStatement",
    expression: {
        type: "CallExpression",
        callee,
        arguments: [],
    }, 
})

const Identifier = (name) => ({
    type: "Identifier",
    name,
})

const ReturnStatement = (arg) => ({
    type: "ReturnStatement",
    argument: Identifier(arg)
})

const RESERVED_KEYWORDS = [FUNCTION, ASSIGNMENT, RETURN, END]

const isFunction = line => line.includes(FUNCTION)
const hasReturn = line => line.includes(RETURN)
const callFunction = value => typeof value === "string" && value !== '' && !RESERVED_KEYWORDS.includes(value) && /^[A-Za-z]+$/.test(value)

const parseProgram = (sourceCode, ast) => {
    const lines = sourceCode.split("\n")

    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i]
        const tokens = line.split(" ")
        
        let declaration = parseVar(tokens, ast)
        ast.program.body.push(declaration)

        if (callFunction(tokens[0])) {
            const functionIdentifier = Identifier(tokens[0])
            const expression = ExpressionStatement(functionIdentifier)

            let arguements = []
            if (tokens[1] === '(') {
                tokens.map((v, i) => {
                    if (i > 1) {
                        arguements.push(v)
                    }
                })
                arguements = arguements.filter(arg => arg !== ')' && arg !== '{')
                arguements.map(arg => {
                    expression.expression.arguments.push(Identifier(arg))
                })
            }

            ast.program.body.push(expression) 
        }

        if (isFunction(tokens)) {
            let identifier = tokens[1]
            const declaration = FunctionDeclaration(identifier)
            const block = BlockStatement()
            declaration.body = block

            for (let lineno = i+1; lineno < lines.length; lineno += 1) {
                const tokens = lines[lineno].split(" ")
                let declarationStatement = lines[lineno-1].split(" ")
                let arguements = []

                if (lines[lineno] === "end") {
                    break
                }
                if (hasReturn(lines[lineno])) {
                    tokens.map(token => {
                        if (token !== "") {
                            if (token !== RETURN) {
                                const returnStatement = ReturnStatement(token)
                                block.body.push(returnStatement)
                            }
                        }
                    })
                }
                if (declarationStatement[2] === '(') {
                    declarationStatement.map((v, i) => {
                        if (i > 2) {
                            arguements.push(v)
                        }
                    })
                    arguements = arguements.filter(arg => arg !== ')')
                    arguements.map(arg => {
                        declaration.params.push(Identifier(arg))
                    })
                }
                const varDecleration = parseVar(tokens, ast)
                const logStatement = parseLog(lines[lineno])
                
                block.body.push(varDecleration)
                block.body.push(logStatement)
            }
            ast.program.body.push(declaration)
        }

        const statement = parseLog(line)
        ast.program.body.push(statement)
    }

    return ast
}

const parse = sourceCode => {
    const ast = AST()
    // Update Program
    parseProgram(sourceCode, ast)
    return ast
}

export default parse