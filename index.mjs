import express from "express";
import anime from "./models/anime.mjs";
import mongoose from "mongoose";
import similarity from "similarity";
import "dotenv/config";

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_CONNECTION_STRING);

const app = express();

app.get("/search", async (req, res) => {
  const query = req.query.q.replaceAll("-", " ");
  const regex = new RegExp('^' + query, 'i');
  let japName = undefined
  
//   /^attack on titan/i

  if (!query) {
    return res.status(400).send("Query is required");
  }

  const result = await anime.find({ $text: { $search: query } });
  const otherNameResult = await anime.find({ other_name: regex });

  for(let i = 0; i < otherNameResult.length; i++){
    result.push(otherNameResult[i]);

    if (typeof japName == "undefined"){
        otherNameResult[i]["other_name"].map((otherName) => {
            if (otherName.toLowerCase() == query){
                japName = otherNameResult[i]["anime_name"]
            }
        })
    }
  }

  console.log(japName);

  const filtered_result = result.map((item) => {
    return {
      anime_name: item.anime_name,
    //   gogo_id: item.gogo_id,
    //   cover: item.cover,
    //   type: item.type,
    //   score: item.score,
    //   total_episodes: item.episodes.length,
      other_name: item.other_name
    };
  });
  
  const sorted_filter_result = filtered_result.sort((a, b) => {
    if (typeof japName == "undefined"){
        let similartyA = similarity(a.anime_name, query, {sensitive: false});
        let similartyB = similarity(b.anime_name, query, {sensitive: false});

        return similartyB - similartyA;
    } else {
        let similartyA = similarity(a.anime_name, japName, {sensitive: false});
        let similartyB = similarity(b.anime_name, japName, {sensitive: false});

        return similartyB - similartyA;
    }
  });

  res.json(sorted_filter_result);
});

app.get("/detail", async (req, res) => {
  const gogo_id = req.query.gogo_id;
  const result = JSON.parse(
    JSON.stringify(await anime.findOne({ gogo_id: gogo_id }))
  );
  if (result === null) {
    return res.status(404).send("Anime not found");
  }
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
  };
  res.json(filtered_result);
});

app.get("/get_episodes", async (req, res) => {
  const gogo_id = req.query.gogo_id;
  const result = await anime.findOne({ gogo_id: gogo_id });

  if (result === null) {
    return res.status(404).send("Anime not found");
  }

  const filtered_result = result.episodes;
  res.json(filtered_result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
