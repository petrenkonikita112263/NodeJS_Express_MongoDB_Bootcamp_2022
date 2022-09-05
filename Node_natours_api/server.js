const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })
const app = require("./app")
const port = process.env.PORT
const mongoose = require("mongoose")
const dbUrl = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
)
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have the name"],
        unique: true,
    },
    rating: { type: Number, default: 4.5 },
    price: { type: Number, required: [true, "A tour must have the price"] },
})
const Tour = mongoose.model("Tour", tourSchema)
const testTour = new Tour({
    name: "The Forest Miker",
    rating: 4.7,
    price: 497,
})
testTour
    .save()
    .then((doc) => console.log(doc))
    .catch((error) => console.log("ERROR 💥💥💥", error))

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
