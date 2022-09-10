// const fs = require("fs")
const Tour = require("./../models/tour_model")
const APIFeatures = require("./../utils/api_features")

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

exports.aliasTopTours = (request, response, next) => {
    request.query.limit = "5"
    request.query.sort = "-ratingsAverage,price"
    request.query.fields = "name,price,ratingsAverage,summary,difficulty"
    next()
}

exports.getAllTours = async (request, response) => {
    try {
        const features = new APIFeatures(Tour.find(), request.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
        const tours = await features.query
        response.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours: tours,
            },
        })
    } catch (error) {
        response.status(404).json({
            status: "Failed",
            message: error,
        })
    }
}

exports.getTour = async (request, response) => {
    try {
        const tour = await Tour.findById(request.params.id)
        response.status(200).json({
            status: "success",
            data: {
                tour: tour,
            },
        })
    } catch (error) {
        response.status(404).json({
            status: "Failed",
            message: error,
        })
    }
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

exports.updateTour = async (request, response) => {
    try {
        const tour = await Tour.findByIdAndUpdate(
            request.params.id,
            request.body,
            {
                new: true,
                runValidators: true,
            }
        )
        response.status(200).json({
            status: "success",
            data: {
                tour: tour,
            },
        })
    } catch (error) {
        response.status(404).json({
            status: "Failed",
            message: error,
        })
    }
}

exports.deleteTour = async (request, response) => {
    try {
        await Tour.findByIdAndDelete(request.params.id)
        response.status(204).json({
            status: "success",
            data: null,
        })
    } catch (error) {
        response.status(404).json({
            status: "Failed",
            message: error,
        })
    }
}

exports.getTourStats = async (request, response) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: "$difficulty" },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
        ])
        response.status(200).json({
            status: "success",
            data: {
                stats: stats,
            },
        })
    } catch (error) {
        response.status(404).json({
            status: "Failed",
            message: error,
        })
    }
}

exports.getMonthlyPlan = async (request, response) => {
    try {
        const year = request.params.year * 1
        const plan = await Tour.aggregate([
            {
                $unwind: "$startDates",
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: "$name" },
                },
            },
            {
                $addFields: { month: "$_id" },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: { numTourStarts: -1 },
            },
            {
                $limit: 12,
            },
        ])
        response.status(200).json({
            status: "success",
            data: {
                plan: plan,
            },
        })
    } catch (error) {
        response.status(404).json({
            status: "Failed",
            message: error,
        })
    }
}
