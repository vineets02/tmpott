const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    contenttype: {
      type: mongoose.ObjectId,
      ref: "ContentType",
      required: true,
    },
    price: {
      type: Number, // or any other suitable data type for price
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Movies", movieSchema)
