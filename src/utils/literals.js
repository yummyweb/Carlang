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

export { Argument, StringLiteral, NumericLiteral, BooleanLiteral }