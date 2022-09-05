// const fs = require("fs")
const Tour = require("./../models/tour_model")

// 3) Route handlers
// exports.checkId = (request, response, next, value) => {
//     if (request.params.id * 1 > tours.length) {
//         return response
//             .status(404)
//             .json({ status: "failed", message: "Invalid ID" })
//     }
//     next()
// }

// exports.checkBody = (request, response, next) => {
//     if (!request.body.name || !request.body.price) {
//         return response.status(400).json({
//             status: "failed",
//             message: "Missing name or price parameter",
//         })
//     }
//     next()
// }

exports.getAllTours = (request, response) => {
    console.log(request.requestTime)
    response.json({
        status: "success",
        // results: tours.length,
        // data: {
        //     tours: tours,
        // },
    })
}

exports.getTour = (request, response) => {
    const id = request.params.id * 1
    // const tour = tours.find((element) => element.id === id)
    // response.json({
    //     status: "success",
    //     data: {
    //         tour: tour,
    //     },
    // })
}

exports.createTour = async (request, response) => {
    try {
        const newTour = await Tour.create(request.body)
        response.status(201).json({
            status: "success",
            data: {
                tours: newTour,
            },
        })
    } catch (error) {
        response.status(400).json({
            status: "Failed",
            message: error,
        })
    }
}

exports.updateTour = (request, response) => {
    response.json({
        status: "success",
        // data: { tour: "Updated tour ..." },
    })
}

exports.deleteTour = (request, response) => {
    response.status(204).json({
        status: "success",
        // data: { tour: "Deleted tour ..." },
    })
}
