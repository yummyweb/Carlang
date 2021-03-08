 // Token types
 const STRING = "StringLiteral"
 const NUMBER = "NumericLiteral"
 const BOOLEAN = "BooleanLiteral"
 const ASSIGNMENT = "set"

 // Helper functions
 const isString = value => value.match(/"/g) !== null
 const isNumber = value => value.match(/[0-9]/g) !== null
 const isBool = value => value === "true" || value === "false"
 const isDeclaration = line => line.includes(ASSIGNMENT)
 const cleanString = str => str.replace(/"/g, "")

 // Declarations AST Generators
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

function parseVar(tokens, ast) {
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
        
        let transformedVarArray = []
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== '') {
                transformedVarArray.push(tokens[i])
            }
        }

        const declaration = VariableDeclaration()
        const declarator = VariableDeclarator(transformedVarArray[1], type)

        declarator.init.value = value
        declaration.declarations = [declarator]

        return declaration
    }
}

export default parseVar