import anime from "./models/anime.mjs"
import mongoose from 'mongoose'
import express from "express"
import "dotenv/config"

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING

async function main() {
  await mongoose.connect(MONGO_CONNECTION_STRING)
  
  const result = await anime.find({$text: {$search: "kyou"}})

  console.log(result)
}

main().catch(console.error)