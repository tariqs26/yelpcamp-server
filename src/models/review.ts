import { Schema, model } from "mongoose"

const ReviewSchema = new Schema(
  {
    body: String,
    rating: Number,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
)

export default model("Review", ReviewSchema)
