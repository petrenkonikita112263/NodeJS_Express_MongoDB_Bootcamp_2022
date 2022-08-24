const express = require("express")
const app = express()
const port = 2347
const fs = require("fs")
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

app.get("/api/v1/tours", (request, response) => {
    response.json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours,
        },
    })
})

app.listen(port, () => {
    console.log(`App running on port ... ${port} ... `)
})
