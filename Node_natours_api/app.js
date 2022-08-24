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

app.get("/api/v1/tours/:id", (request, response) => {
    const id = request.params.id * 1
    const tour = tours.find((element) => element.id === id)
    if (!tour) {
        return response
            .status(404)
            .json({ status: "failed", message: "Invalid ID" })
    }
    response.json({
        status: "success",
        data: {
            tour: tour,
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

app.patch("/api/v1/tours/:id", (request, response) => {
    if (request.params.id * 1 > tours.length) {
        return response
            .status(404)
            .json({ status: "failed", message: "Invalid ID" })
    }
    response.json({
        status: "success",
        data: { tour: "Updated tour ..." },
    })
})

app.listen(port, () => {
    console.log(`App running on port ... ${port} ... `)
})
