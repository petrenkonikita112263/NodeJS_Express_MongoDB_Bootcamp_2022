// const fs = require("fs")
const Tour = require("./../models/tour_model")
const APIFeatures = require("./../utils/api_features")
const catchAsyncErrors = require("./../utils/catch_async_errors")

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

exports.getAllTours = catchAsyncErrors(async (request, response, next) => {
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
})

exports.getTour = catchAsyncErrors(async (request, response, next) => {
    const tour = await Tour.findById(request.params.id)
    response.status(200).json({
        status: "success",
        data: {
            tour: tour,
        },
    })
})

exports.createTour = catchAsyncErrors(async (request, response, next) => {
    const newTour = await Tour.create(request.body)
    response.status(201).json({
        status: "success",
        data: {
            tours: newTour,
        },
    })
})

exports.updateTour = catchAsyncErrors(async (request, response, next) => {
    const tour = await Tour.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true,
    })
    response.status(200).json({
        status: "success",
        data: {
            tour: tour,
        },
    })
})

exports.deleteTour = catchAsyncErrors(async (request, response, next) => {
    await Tour.findByIdAndDelete(request.params.id)
    response.status(204).json({
        status: "success",
        data: null,
    })
})

exports.getTourStats = catchAsyncErrors(async (request, response, next) => {
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
})

exports.getMonthlyPlan = catchAsyncErrors(async (request, response, next) => {
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
})
