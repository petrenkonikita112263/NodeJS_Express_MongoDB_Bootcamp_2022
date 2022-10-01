const appError = require("./../utils/appError")

const sendErrorDev = (error, response) => {
    response.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
    })
}

const sendErrorProd = (error, response) => {
    // Operational, trusted error
    if (err.isOperational) {
        response.status(error.statusCode).json({
            status: error.status,
            error: error,
        })
    }
    // Programming or other unknown error
    else {
        console.error("ERROR 💥💥💥", error)
        response.status(500).json({
            status: "Error",
            message: "Something went very wrong!",
        })
    }
}

const handleCastErrorDB = (error) => {
    const message = `Invalid ${error.path}: ${error.value}.`
    return new appError(message, 400)
}

const handleDuplicateFieldsDB = (error) => {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new appError(message, 400)
}

const handleValidationErrorDB = (error) => {
    const errors = Object.values(error.errors).map((element) => element.message)
    const message = `Invalid input data. ${errors.join(". ")}`
    return new appError(message, 400)
}

module.exports = (error, request, response, next) => {
    error.statusCode = error.statusCode || 500
    error.status = error.status || "Error"
    response
        .status(error.statusCode)
        .json({ status: error.status, message: error.message })
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, response)
    } else if (process.env.NODE_ENV === "production") {
        let errors = { ...error }
        if (errors.name === "CastError") errors = handleCastErrorDB(errors)
        if (errors.code === 11000) errors = handleDuplicateFieldsDB(errors)
        if (errors.name === "ValidationError")
            errors = handleValidationErrorDB(error)
        sendErrorProd(errors, response)
    }
}
