const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const { MongoClient, ServerApiVersion } = require("mongodb")
const Blog = require("./models/blog")
const port = 2348

// express app
const app = express()

// conntect to MongoDB
const dbURI = process.env.DB_URI
const client = new MongoClient(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})
client.connect((error) => {
    const collection = client.db("blogSite").collection("blogs")
    console.log("Connect successfully")
    app.listen(port)
    client.close()
})

// register view engine
app.set("view engine", "ejs")

// static files & middlewares
app.use(express.static("public"))
app.use(morgan("dev"))

// routes
app.get("/", (request, response) => {
    response.redirect("/blogs")
})

app.get("/about", (request, response) => {
    response.render("about", { title: "About" })
})

// blog routes
app.get("/blogs/create", (request, response) => {
    response.render("create", { title: "Create a new blog" })
})

app.get("/blogs", (request, response) => {
    Blog.find()
        .sort({ createdAt: -1 })
        .then((result) => {
            response.render("index", { blogs: result, title: "All blogs" })
        })
        .catch((error) => {
            console.log(error)
        })
})

app.post("/blogs", (request, response) => {
    const blog = new Blog(request.body)
    blog.save()
        .then((result) => {
            response.redirect("/blogs")
        })
        .catch((error) => {
            console.log(error)
        })
})

app.get("/blogs/:id", (request, response) => {
    const id = request.params.id
    Blog.findById(id)
        .then((result) => {
            response.render("details", { blog: result, title: "Blog Details" })
        })
        .catch((error) => {
            console.log(error)
        })
})

app.delete("/blogs/:id", (request, response) => {
    const id = request.params.id
    Blog.findByIdAndDelete(id)
        .then((result) => {
            response.json({ redirect: "/blogs" })
        })
        .catch((error) => {
            console.log(error)
        })
})

// error page
app.use((request, response) => {
    response.status(404).render("404", { title: "404 page" })
})
