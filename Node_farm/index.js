const fsModule = require("fs")
const httpModule = require("http")
const urlModule = require("url")

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
    const pathName = request.url
    if (pathName === "/" || pathName === "/overview") {
        response.end("This is the OVERWIE page")
    } else if (pathName === "/product") {
        response.end("This is the PRODUCT page")
    } else if (pathName === "/API") {
        fsModule.readFile(".\\dev-data\\data.json", "utf-8", (error, data) => {
            const productData = JSON.parse(data)
            console.log(productData)
            response.writeHead(200, {
                "Content-type": "application/json",
            })
            response.end(data)
        })
    } else {
        response.writeHead(404, {
            "Content-type": "text/html",
        })
        response.end("<h1>Page was not found</h1>")
    }
})
createdServer.listen(8000, "localhost", () => {
    console.log("Listening to request on port 8000")
})
