const fsModule = require("fs")
const httpModule = require("http")

// Synch approach
// const inputText = fsModule.readFileSync(".\\txt\\input.txt", "utf-8")
// console.log(inputText)

// const sendingText = `This is what we know about the avocado: ${inputText}.\nCreated on ${Date.now()}`
// fsModule.writeFileSync(".\\txt\\output.txt", sendingText)
// console.log("File was writtent")

// Asynch approac
// fsModule.readFile(".\\txt\\start.txt", "utf-8", (error, data1) => {
//     console.log(data1)
//     fsModule.readFile(`.\\txt\\append.txt`, "utf-8", (error, data2) => {
//         console.log(data2)
//         fsModule.writeFile(
//             ".\\txt\\final.txt",
//             `${data1}\n${data2}`,
//             "utf-8",
//             (error) => {
//                 console.log("The final.txt file was written")
//             }
//         )
//     })
// })
// console.log("The file was read")

// Server
const createdServer = httpModule.createServer((request, response) => {
    console.log(request)
    response.end("Hello from the server!")
})
createdServer.listen(8000, "localhost", () => {
    console.log("Listening to request on port 8000")
})
