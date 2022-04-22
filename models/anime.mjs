import mongoose from "mongoose"

const anime_schema = new mongoose.Schema({
    anime_name: { type: String },
    gogo_id: { type: String },
    cover: { type: String },
    type: { type: String },
    plot_summary: { type: String },
    genre: { type: Array },
    release: { type: String },
    other_name: { type: Array },
    trailer: { type: String },
    score: { type: String },
    url: { type: String },
    episodes: { type: Array },
})
anime_schema.index({ anime_name: "text" })

const anime = mongoose.model("anime", anime_schema)

export default anime