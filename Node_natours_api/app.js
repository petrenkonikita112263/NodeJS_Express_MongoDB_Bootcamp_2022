// 1) Constants and imports
const express = require("express")
const app = express()
const tourRouter = require("./routes/tour_routes")
const userRouter = require("./routes/user_routes")
const morgan = require("morgan")

// 2) Middleware
app.use(morgan("dev"))
app.use(express.json())
app.use((request, response, next) => {
    request.requestTime = new Date().toISOString()
    next()
})

// 3) Routes
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

module.exports = app
