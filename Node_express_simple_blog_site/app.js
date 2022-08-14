const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const port = 2348

// express app
const app = express()

// conntect to MongoDB
const dbURI =
    "mongodb+srv://editor_blog:8Wgp9Dk4yCDVtjZi@cluster0.qmao9io.mongodb.net/?retryWrites=true&w=majority"
mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        // listen for requests
        app.listen(port)
    })
    .catch((error) => console.log(error))

// register view engine
app.set("view engine", "ejs")

// static files & middlewares
app.use(express.static("public"))
app.use(morgan("dev"))

// routes
app.get("/", (request, response) => {
    const blogs = [
        {
            title: "Yoshi finds eggs",
            snippet: "Lorem ipsum dolor sit amet consectetur",
        },
        {
            title: "Mario finds stars",
            snippet: "Lorem ipsum dolor sit amet consectetur",
        },
        {
            title: "How to defeat bowser",
            snippet: "Lorem ipsum dolor sit amet consectetur",
        },
    ]
    response.render("index", { title: "Home", blogs })
})

app.get("/about", (request, response) => {
    response.render("about", { title: "About" })
})

app.get("/blogs/create", (request, response) => {
    response.render("create", { title: "Create a new blog" })
})

// error page
app.use((request, response) => {
    response.status(404).render("404", { title: "404 page" })
})
