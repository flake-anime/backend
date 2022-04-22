import express from "express"
import anime from "./models/anime.mjs"
import mongoose from 'mongoose'
import "dotenv/config"

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING
const PORT = process.env.PORT || 3000

mongoose.connect(MONGO_CONNECTION_STRING)

const app = express()

app.get("/search", async (req, res) => {
    const query = req.query.q
    const result = await anime.find({$text: {$search: query}})
    res.json(result)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})