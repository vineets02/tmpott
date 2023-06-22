import mongoose from "mongoose"

const contentAdvisorySchema = new mongoose.Schema({
  ContentAdvisory: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
})

export default mongoose.model("ContentAdvisory", contentAdvisorySchema)
