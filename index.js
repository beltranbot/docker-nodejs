const express = require("express")
const mongoose = require("mongoose")
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config")

const postRouter = require("./routes/postRoutes")

const app = express()

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("sucesfully connected to DB"))
    .catch((e) => {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()

// middleware to allow body to be attached to a request
app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h2> Hi There </h2>")
})

app.use("/api/v1/posts", postRouter)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening to port ${port}`))
