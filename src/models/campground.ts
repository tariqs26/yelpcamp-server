import { Schema, model } from "mongoose"
import Review from "./review"

const CampgroundSchema = new Schema(
  {
    title: String,
    description: String,
    location: String,
    price: Number,
    image: String,
    geometry: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
)

CampgroundSchema.post("findOneAndDelete", async doc => {
  if (doc) await Review.deleteMany({ _id: { $in: doc.reviews } })
})

export default model("Campground", CampgroundSchema)
