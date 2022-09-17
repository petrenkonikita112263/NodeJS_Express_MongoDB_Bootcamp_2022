// 1) Constants and imports
const express = require("express")
const app = express()
const tourRouter = require("./routes/tour_routes")
const userRouter = require("./routes/user_routes")
const morgan = require("morgan")

// 2) Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}
app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.use((request, response, next) => {
    request.requestTime = new Date().toISOString()
    next()
})

// 3) Routes
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.all("*", (request, response) => {
    response.status(404).json({
        status: "Failed",
        message: `Can't find ${request.originalUrl} on this server!`,
    })
})

module.exports = app
