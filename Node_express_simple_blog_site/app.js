const express = require("express")
const morgan = require("morgan")
const port = 2348

// express app
const app = express()

// listen for requests
app.listen(port)

// register view engine
app.set("view engine", "ejs")

// static files
app.use(express.static("public"))

// middleware
app.use((request, response, next) => {
    console.log("new request made:")
    console.log(`host: ${request.hostname}`)
    console.log(`path: ${request.path}`)
    console.log(`method: ${request.method}`)
    next()
})

app.use((request, response, next) => {
    console.log("in the next middleware")
    next()
})

app.use(morgan("dev"))

app.use((request, response, next) => {
    response.locals.path = request.path
    next()
})

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
