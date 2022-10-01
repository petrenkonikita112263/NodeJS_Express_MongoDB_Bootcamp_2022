const sendErrorDev = (error, response) => {
    response.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
    })
}

const sendErrorProd = (error, response) => {
    response.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack,
    })
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
        sendErrorProd(error, response)
    }
}
