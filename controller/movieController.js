// import productModel from "../models/productModel.js"
const fs = require("fs")
const slugify = require("slugify")
const movieModel = require("../models/movieModel.js")
const path = require("path")
const braintree = require("braintree")
const orderModel = require("../models/orderModel.js")

//payment gateway
let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "49pxt4d7m7d8j64s",
  publicKey: "dgfbbtbn63sp3drx",
  privateKey: "658ad1fffb738c79f2412c5d9848a739",
})

module.exports.createMovieController = async (req, res) => {
  try {
    const {
      title,
      director,
      description,
      category,
      duration,
      language,

      contenttype,
    } = req.fields
    const { poster, video, trailer } = req.files
    //alidation
    switch (true) {
      case !title:
        return res.status(500).send({ error: "Name is Required" })
      case !director:
        return res.status(500).send({ error: "director is Required" })
      case !description:
        return res.status(500).send({ error: "description is Required" })
      case !duration:
        return res.status(500).send({ error: "duration is Required" })
      case !language:
        return res.status(500).send({ error: "language is Required" })
      case !trailer:
        return res.status(500).send({ error: "trailer is Required" })
      case !category:
        return res.status(500).send({ error: "Category is Required" })
      case !contenttype:
        return res.status(500).send({ error: "contenttype is Required" })
      case poster && poster.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" })
    }

    const products = new movieModel({ ...req.fields, slug: slugify(title) })

    if (poster) {
      const uploadDir = path.join(process.cwd(), "upload") // Path to the upload folder
      const uploadPath = path.join(uploadDir, poster.name) // Path to store the uploaded image

      // Move the image file to the upload folder
      await fs.promises.rename(poster.path, uploadPath)

      // Store the relative path of the image in the products document
      products.poster = `upload/${poster.name}`
    }
    if (video) {
      const uploadDir = path.join(process.cwd(), "upload")
      const uploadPath = path.join(uploadDir, video.name)

      // Move the video file to the upload folder
      await fs.promises.rename(video.path, uploadPath)

      // Store the relative path of the video in the movie document
      products.video = `upload/${video.name}`
    }
    if (trailer) {
      const uploadDir = path.join(process.cwd(), "upload")
      const uploadPath = path.join(uploadDir, trailer.name)

      // Move the video file to the upload folder
      await fs.promises.rename(trailer.path, uploadPath)

      // Store the relative path of the video in the movie document
      products.trailer = `upload/${trailer.name}`
    }

    await products.save()
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    })
  }
}

//get all products
module.exports.getMovieController = async (req, res) => {
  try {
    const movies = await movieModel
      .find({})
      .populate("category")
      .populate("contenttype")
      .select("-poster")
      .limit(12)
      .sort({ createdAt: -1 })
    res.status(200).send({
      success: true,
      counTotal: movies.length,
      message: "ALlProducts ",
      movies,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    })
  }
}
// get single product
module.exports.getSingleMovieController = async (req, res) => {
  try {
    const movie = await movieModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .populate("contenttype")

    res.status(200).send({
      success: true,
      message: "Single Movie Fetched",
      movie,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while getting single movie",
      error,
    })
  }
}

// get photo
module.exports.moviePosterController = async (req, res) => {
  try {
    const movie = await movieModel.findById(req.params.pid).select("poster")

    if (movie.poster) {
      const posterPath = path.join(process.cwd(), movie.poster)

      // Read the poster file and send it as the response
      fs.readFile(posterPath, (err, data) => {
        if (err) {
          console.log(err)
          res.status(500).send({
            success: false,
            message: "Error while reading poster",
            error: err,
          })
        } else {
          res.set("Content-Type", "image/jpeg")
          res.send(data)
        }
      })
    } else {
      res.status(404).send({
        success: false,
        message: "Poster not found",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while getting poster",
      error,
    })
  }
}

module.exports.movieVideoController = async (req, res) => {
  try {
    const movie = await movieModel.findById(req.params.pid).select("video")

    if (movie.video) {
      const videoPath = path.join(process.cwd(), movie.video)

      // Read the video file and send it as the response
      fs.readFile(videoPath, (err, data) => {
        if (err) {
          console.log(err)
          res.status(500).send({
            success: false,
            message: "Error while reading video",
            error: err,
          })
        } else {
          res.set("Content-Type", "video/mp4")
          res.send(data)
        }
      })
    } else {
      res.status(404).send({
        success: false,
        message: "Video not found",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while getting video",
      error,
    })
  }
}
module.exports.movieTrailerController = async (req, res) => {
  try {
    const movie = await movieModel.findById(req.params.pid).select("trailer")

    if (movie.trailer) {
      const videoPath = path.join(process.cwd(), movie.trailer)

      // Read the video file and send it as the response
      fs.readFile(videoPath, (err, data) => {
        if (err) {
          console.log(err)
          res.status(500).send({
            success: false,
            message: "Error while reading trailer",
            error: err,
          })
        } else {
          res.set("Content-Type", "video/mp4")
          res.send(data)
        }
      })
    } else {
      res.status(404).send({
        success: false,
        message: "Video not found",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while getting trailer",
      error,
    })
  }
}

//delete controller
module.exports.deleteMovieController = async (req, res) => {
  try {
    await movieModel.findByIdAndDelete(req.params.pid)

    res.status(200).send({
      success: true,
      message: "Movie deleted successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while deleting movie",
      error,
    })
  }
}

// export const updateMovieController = async (req, res) => {
//   try {
//     const { title, director, description, contenttype, category } = req.body
//     const { poster } = req.files

//     switch (true) {
//       case !title:
//         return res.status(500).send({ error: "title is Required" })
//       case !director:
//         return res.status(500).send({ error: "Description is Required" })
//       case !description:
//         return res.status(500).send({ error: "Price is Required" })
//       case !category:
//         return res.status(500).send({ error: "Category is Required" })
//       case !contenttype:
//         return res.status(500).send({ error: "Quantity is Required" })
//       case poster && poster.size > 1000000:
//         return res
//           .status(500)
//           .send({ error: "photo is Required and should be less then 1mb" })
//     }

//     const movie = await movieModel.findByIdAndUpdate(
//       req.params.pid,
//       { ...req.fields, slug: slugify(title) },
//       { new: true }
//     )

//     if (poster) {
//       const uploadDir = path.join(process.cwd(), "upload")
//       const uploadPath = path.join(uploadDir, poster.name)

//       // Move the poster file to the upload folder
//       await fs.promises.rename(poster.path, uploadPath)

//       // Store the relative path of the poster in the movie document
//       movie.poster = `upload/${poster.name}`
//     }

//     await movie.save()

//     res.status(201).send({
//       success: true,
//       message: "Movie Updated Successfully",
//       movie,
//     })
//   } catch (error) {
//     console.log(error)
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in updating movie",
//     })
//   }
// }
//upate producta
module.exports.updateMovieController = async (req, res) => {
  try {
    const {
      title,
      director,
      description,
      duration,
      language,
      trailer,
      category,
      contenttype,
    } = req.fields
    const { poster, video } = req.files
    //alidation
    switch (true) {
      case !title:
        return res.status(500).send({ error: "Name is Required" })
      case !director:
        return res.status(500).send({ error: "director is Required" })
      case !description:
        return res.status(500).send({ error: "description is Required" })
      case !duration:
        return res.status(500).send({ error: "duration is Required" })
      case !language:
        return res.status(500).send({ error: "language is Required" })
      case !trailer:
        return res.status(500).send({ error: "trailer is Required" })
      case !category:
        return res.status(500).send({ error: "Category is Required" })
      case !contenttype:
        return res.status(500).send({ error: "Quantity is Required" })
      case poster && poster.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" })
    }

    const products = await movieModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(title),
      },
      { new: true }
    )
    if (!products) {
      return res.status(404).send({ error: "Product not found" })
    }
    if (poster) {
      const uploadDir = path.join(process.cwd(), "upload") // Path to the upload folder
      const uploadPath = path.join(uploadDir, poster.name) // Path to store the uploaded image

      // Move the image file to the upload folder
      await fs.promises.rename(poster.path, uploadPath)

      // Store the relative path of the image in the products document
      products.poster = `upload/${poster.name}`
    }
    if (video) {
      const uploadDir = path.join(process.cwd(), "upload")
      const uploadPath = path.join(uploadDir, video.name)

      // Move the video file to the upload folder
      await fs.promises.rename(video.path, uploadPath)

      // Store the relative path of the video in the movie document
      products.video = `upload/${video.name}`
    }

    // const products = await movieModel.findByIdAndUpdate(
    //   req.params.pid,
    //   { ...req.fields, slug: slugify(title) },
    //   { new: true }
    // )
    // if (photo) {
    //   products.photo.data = fs.readFileSync(photo.path)
    //   products.photo.contentType = photo.type
    // }
    await products.save()
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    })
  }
}

//search movies
module.exports.movieSearchController = async (req, res) => {
  try {
    const { keyword } = req.params
    const results = await movieModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-poster")
    res.json(results)
    console.log(results)
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "error in search movie",
      error,
    })
  }
}

module.exports.relatedMovieController = async (req, res) => {
  try {
    const { pid, cid } = req.params
    const movies = await movieModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-poster")
      .limit(3)
      .populate("category")
    res.status(200).send({
      success: true,
      movies,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "error in related movies",
      error,
    })
  }
}
// module.exports = {
//   createMovieController,
//   getMovieController,
//   getSingleMovieController,
//   moviePosterController,
//   movieVideoController,
//   movieTrailerController,
//   deleteMovieController,
//   updateMovieController,
//   movieSearchController,
//   relatedMovieController,
// }

module.exports.braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.send(response)
        console.log(response)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports.brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, rent } = req.body
    let total = 0
    rent.map((i) => {
      total += i.price
    })
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            movies: rent,
            payment: result,
            buyer: req.user._id,
            // status: "pending",
          }).save()
          res.json({ ok: true })
        } else {
          res.status(500).send(error)
        }
      }
    )
  } catch (error) {
    console.log(error)
  }
}
