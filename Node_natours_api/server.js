const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })
const app = require("./app")
const port = process.env.PORT
const mongoose = require("mongoose")
const dbUrl = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
)

process.on("uncaughtException", (error) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...")
    console.log(error.name, error.message)
    process.exit(1)
})

mongoose
    .connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then((connection) => {
        console.log("DB connection is successful")
    })

const server = app.listen(port, () => {
    console.log(`App running on port ... ${port} ... `)
})

process.on("unhandledRejection", (ererrorr) => {
    console.log("UNHANDLED REJECTION! 💥💥💥 Shutting down...")
    console.log(error.name, error.message)
    server.close(() => {
        process.exit(1)
    })
})
