// 1) Constants and imports
const express = require("express")
const app = express()
const port = 2347
const fs = require("fs")
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)
const morgan = require("morgan")

// 2) Middleware
app.use(morgan("dev"))

app.use(express.json())
app.use((request, response, next) => {
    console.log("Hello from the middleware 👏")
    next()
})

app.use((request, response, next) => {
    request.requestTime = new Date().toISOString()
    next()
})

// 3) Route handlers
const getAllTours = (request, response) => {
    console.log(request.requestTime)
    response.json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours,
        },
    })
}

const getTour = (request, response) => {
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
}

const createTour = (request, response) => {
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
}

const updateTour = (request, response) => {
    if (request.params.id * 1 > tours.length) {
        return response
            .status(404)
            .json({ status: "failed", message: "Invalid ID" })
    }
    response.json({
        status: "success",
        data: { tour: "Updated tour ..." },
    })
}

const deleteTour = (request, response) => {
    if (request.params.id * 1 > tours.length) {
        return response
            .status(404)
            .json({ status: "failed", message: "Invalid ID" })
    }
    response.status(204).json({
        status: "success",
        data: { tour: "Deleted tour ..." },
    })
}

const getAllUsers = (request, response) => {
    response
        .status(500)
        .json({ status: "error", message: "This route is not yet implemented" })
}

const createUser = (request, response) => {
    response
        .status(500)
        .json({ status: "error", message: "This route is not yet implemented" })
}

const getUser = (request, response) => {
    response
        .status(500)
        .json({ status: "error", message: "This route is not yet implemented" })
}

const updateUser = (request, response) => {
    response
        .status(500)
        .json({ status: "error", message: "This route is not yet implemented" })
}

const deleteUser = (request, response) => {
    response
        .status(500)
        .json({ status: "error", message: "This route is not yet implemented" })
}

// 4) Routes
app.route("/api/v1/tours").get(getAllTours).post(createTour)
app.route("/api/v1/tours/:id").get(getTour).patch(updateTour).delete(deleteTour)
app.route("/api/v1/users").get(getAllUsers).post(createUser)
app.route("/api/v1/users/:id").get(getUser).patch(updateUser).delete(deleteUser)

// 5) Start service
app.listen(port, () => {
    console.log(`App running on port ... ${port} ... `)
})
