const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const { MongoClient, ServerApiVersion } = require("mongodb")
const Blog = require("./models/blog")
const blogRoutes = require("./routes/blog_routes")
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
app.use("/blogs", blogRoutes)

// error page
app.use((request, response) => {
    response.status(404).render("404", { title: "404 page" })
})
