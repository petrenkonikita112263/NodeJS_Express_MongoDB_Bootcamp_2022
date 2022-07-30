const fsModule = require("fs")

const inputText = fsModule.readFileSync(".\\txt\\input.txt", "utf-8")
console.log(inputText)

const sendingText = `This is what we know about the avocado: ${inputText}.\nCreated on ${Date.now()}`
fsModule.writeFileSync(".\\txt\\output.txt", sendingText)
console.log("File was writtent")
