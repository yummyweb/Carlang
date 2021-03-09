import parseVar from "./variables.js"
import parseLog from "./log.js"

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

const ExpressionStatement = (obj, props) => ({
    type: "ExpressionStatement",
    expression: {
        type: "CallExpression",
        callee: {
            type: "MemberExpression",
            object: {
                type: "Identifier",
                name: obj,
            },
            ...props,
            computed: false,
        },
        arguments: [],
    }, 
})

const FUNCTION = "func"

const isFunction = line => line.includes(FUNCTION)

const parseProgram = (sourceCode, ast) => {
    const lines = sourceCode.split("\n")

    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i]
        const tokens = line.split(" ")
        
        let declaration = parseVar(tokens, ast)
        ast.program.body.push(declaration)

        if (isFunction(tokens)) {
            let identifier = tokens[1]
            const declaration = FunctionDeclaration(identifier)
            const block = BlockStatement()
            declaration.body = block

            for (let lineno = i+1; lineno < lines.length; lineno += 1) {
                const tokens = lines[lineno].split(" ")
                if (tokens[0] === "}") {
                    break
                }
                else {
                    const varDecleration = parseVar(tokens, ast)
                    block.body.push(varDecleration)
                }
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