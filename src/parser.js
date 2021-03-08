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

const VariableDeclaration = () => ({
    type: "VariableDeclaration",
    declarations: [],
    kind: "const",
})

const VariableDeclarator = (token, type) => ({
    type: "VariableDeclarator",
    id: {
        type: "Identifier",
        name: token,
    },
    init: {
        type,
        value: null,
    },
})

const ConsoleStatement = () => ({
    type: "ExpressionStatement",
    expression: {
        type: "CallExpression",
        callee: {
            type: "MemberExpression",
            object: {
                type: "Identifier",
                name: "console",
            },
            property: {
                type: "Identifier",
                name: "log",
            },
            computed: false,
        },
        arguments: [],
    },
})

const Argument = name => ({
    type: "Identifier",
    name,
})

const StringLiteral = value => ({
    type: "StringLiteral",
    value,
})

const NumericLiteral = value => ({
    type: "NumericLiteral",
    value,
})

const BooleanLiteral = value => ({
    type: "BooleanLiteral",
    value,
})

const cleanString = str => str.replace(/"/g, "")

const ASSIGNMENT = "set"
const STRING = "StringLiteral"
const NUMBER = "NumericLiteral"
const BOOLEAN = "BooleanLiteral"

const isDeclaration = line => line.includes(ASSIGNMENT)
const isLog = line => line.match(/^log\s/g) !== null
const isString = value => value.match(/"/g) !== null
const isNumber = value => value.match(/[0-9]/g) !== null
const isBool = value => value === "true" || value === "false"

const parseProgram = (sourceCode, ast) => {
    const lines = sourceCode.split("\n")

    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i]
        const tokens = line.split(" ")

        if (isDeclaration(tokens)) {
            let value = tokens[tokens.length - 1]
            let type

            if (isString(value)) {
                type = STRING
                value = cleanString(value)
            }

            if (isNumber(value)) {
                type = NUMBER
            }

            if (isBool(value)) {
                type = BOOLEAN
            }

            const declaration = VariableDeclaration()
            const declarator = VariableDeclarator(tokens[1], type)

            declarator.init.value = value
            declaration.declarations = [declarator]

            ast.program.body.push(declaration)
        }

        if (isLog(line)) {
            const values = line.split(" ").slice(1)
            const statement = ConsoleStatement()

            statement.expression.arguments = values.map(value => {
                if (isString(value)) {
                    return StringLiteral(cleanString(value))
                }
                else if (isNumber(value)) {
                    return NumericLiteral(value)
                }
                return Argument(value)
            })

            ast.program.body.push(statement)
        }
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