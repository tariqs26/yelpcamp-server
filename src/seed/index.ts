import mongoose, { connect, set } from "mongoose"
import { env } from "../lib/env"
import Campground from "../models/campground"
import cities from "./cities.json"
import { descriptions, descriptors, places } from "./seed-helpers.json"

set("strictQuery", true)
connect(env.DATABASE_URL).catch(error => {
  console.error(error)
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Database connected")
})

const sample = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 20; i++) {
    const randomCity = Math.floor(Math.random() * 494)
    const camp = new Campground({
      author: "63de3fd6cf2b890846c31672",
      location: `${cities[randomCity]?.city}, ${cities[randomCity]?.province}`,
      geometry: {
        type: "Point",
        coordinates: [cities[randomCity]?.lng, cities[randomCity]?.lat],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      image:
        "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      description: sample(descriptions),
      price: Math.floor(Math.random() * 20) + 10,
    })
    await camp.save()
  }
}

seedDB()
  .then(() => {
    mongoose.connection.close().catch(error => {
      console.error(error)
    })
    console.log("Database disconnected")
  })
  .catch(error => {
    console.error(error)
  })
