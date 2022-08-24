const express = require("express")
const app = express()
const port = 2347
const fs = require("fs")
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

app.use(express.json())

app.get("/api/v1/tours", (request, response) => {
    response.json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours,
        },
    })
})

app.post("/api/v1/tours", (request, response) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign(
        {
            id: newId,
        },
        request.body
    )
    tours.push(newTour)
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (error) => {
            response.json({
                status: "success",
                data: {
                    tours: tours,
                },
            })
        }
    )
})

app.listen(port, () => {
    console.log(`App running on port ... ${port} ... `)
})
