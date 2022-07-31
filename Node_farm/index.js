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
const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)
    if (!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic")
    return output
}

const templateOverview = fsModule.readFileSync(
    ".\\templates\\template_overview.html",
    "utf-8"
)
const templateCard = fsModule.readFileSync(
    ".\\templates\\template_card.html",
    "utf-8"
)
const templateProduct = fsModule.readFileSync(
    ".\\templates\\template_product.html",
    "utf-8"
)
const data = fsModule.readFileSync(".\\dev-data\\data.json", "utf-8")
const dataObject = JSON.parse(data)

const createdServer = httpModule.createServer((request, response) => {
    const { query, pathname } = urlModule.parse(request.url, true)
    if (pathname === "/" || pathname === "/overview") {
        response.writeHead(200, {
            "Content-type": "text/html",
        })
        const cardsHtml = dataObject
            .map((element) => replaceTemplate(templateCard, element))
            .join("")
        const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)
        response.end(output)
    } else if (pathname === "/product") {
        const product = dataObject[query.id]
        response.writeHead(200, {
            "Content-type": "text/html",
        })
        const output = replaceTemplate(templateProduct, product)
        response.end(output)
    } else if (pathname === "/API") {
        response.writeHead(200, {
            "Content-type": "application/json",
        })
        response.end(data)
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
