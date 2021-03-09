import { ASSIGNMENT } from './tokenTypes.js'

// Helper functions
const isString = value => value.match(/"/g) !== null
const isNumber = value => value.match(/[0-9]/g) !== null
const isBool = value => value === "true" || value === "false"
const isDeclaration = line => line.includes(ASSIGNMENT)
const cleanString = str => str.replace(/"/g, "")
const isLog = line => line.match(/^log\s/g) !== null

export { isString, isNumber, isBool, isDeclaration, cleanString, isLog }