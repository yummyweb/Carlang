import { isLog } from './utils/helpers.js'
import { isString, isNumber, isBool } from './utils/helpers.js'
import { Argument, StringLiteral, NumericLiteral, BooleanLiteral } from './utils/literals.js'

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

function parseLog(line) {   
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
            else if (isBool(value)) {
                return BooleanLiteral(value)
            }
            
            return Argument(value)
        })

        return statement
    }
}

export default parseLog