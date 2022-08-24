const express = require("express")
const app = express()
const port = 2347

app.get("/", (resquest, response) => {
    response.status(200)
    response.json({ message: "Hello from the server side!", app: "Natours" })
})

app.post("/", (request, response) => {
    response.send("You can post to this endpoint ...")
})

app.listen(port, () => {
    console.log(`App running on port ... ${port} ... `)
})
