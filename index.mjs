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
    const filtered_result = result.map(item => {
        return {
            anime_name: item.anime_name,
            gogo_id: item.gogo_id,
            cover: item.cover,
            type: item.type,
            score: item.score,
        }
    })
    res.json(filtered_result)
})

app.get("/detail", async (req, res) => {
    const gogo_id = req.query.gogo_id
    const result = await anime.findOne({gogo_id: gogo_id})
    const filtered_result = {
        _id: result._id,
        anime_name: result.anime_name,
        gogo_id: result.gogo_id,
        genres: result.genres,
        cover: result.cover,
        type: result.type,
        plot_summary: result.plot_summary,
        release: result.release,
        status: result.status,
        other_name: result.other_name,
        trailer: result.trailer,
        score: result.score,
        url: result.url,
    }
    res.json(filtered_result)
})

app.get("/get_episodes", async (req, res) => {
    const gogo_id = req.query.gogo_id
    const result = await anime.findOne({gogo_id: gogo_id})
    const filtered_result = result.episodes
    res.json(filtered_result)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
