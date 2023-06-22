const mongoose = require("mongoose")

const connectDB = async () => {
  const conn = await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected".bgMagenta.white))
    .catch((err) => console.log(err))
}

module.exports = connectDB
