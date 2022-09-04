const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })
const app = require("./app")
const port = process.env.PORT
const mongoose = require("mongoose")
const dbUrl = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
)

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

app.listen(port, () => {
    console.log(`App running on port ... ${port} ... `)
})
