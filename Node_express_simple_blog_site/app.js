const express = require("express")
const port = 2348

// express app
const app = express()

// listen for requests
app.listen(port)
app.get("/", (request, response) => {
    response.sendFile("./views/index.html", { root: __dirname })
})

app.get("/about", (request, response) => {
    response.sendFile("./views/about.html", { root: __dirname })
})

// redirects
app.get("/about-us", (request, response) => {
    response.redirect("/about")
})

// error page
app.use((request, response) => {
    response.sendFile("./views/404.html", { root: __dirname })
})
