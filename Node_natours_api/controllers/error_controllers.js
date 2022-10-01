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
        sendErrorProd(errors, response)
    }
}
