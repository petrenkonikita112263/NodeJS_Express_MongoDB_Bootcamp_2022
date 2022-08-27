const fs = require("fs")
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

// 3) Route handlers
exports.getAllTours = (request, response) => {
    console.log(request.requestTime)
    response.json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours,
        },
    })
}

exports.getTour = (request, response) => {
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

exports.createTour = (request, response) => {
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

exports.updateTour = (request, response) => {
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

exports.deleteTour = (request, response) => {
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
