const express = require("express")
// const {
//   createProductController,
//   deleteProductController,
//   getProductController,
//   getSingleProductController,
//   productPhotoController,
//   updateProductController,
// } = require("../controllers/productController.js");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware.js")
const formidable = require("express-formidable")
const {
  createMovieController,
  deleteMovieController,
  getMovieController,
  getSingleMovieController,
  moviePosterController,
  movieSearchController,
  movieTrailerController,
  movieVideoController,
  relatedMovieController,
  updateMovieController,
  braintreeTokenController,
  braintreePaymentController,
  brainTreePaymentController,
} = require("../controller/movieController.js")
// const multer = require("multer");

const router = express.Router()
// const upload = multer({ storage: storage });
//routes
router.post(
  "/create-movie",
  requireSignIn,
  isAdmin,
  // upload.fields([{ name: "poster" }, { name: "video" }]),
  formidable(),
  createMovieController
)
// //routes
router.put(
  "/update-movie/:pid",
  requireSignIn,
  isAdmin,
  formidable(),

  updateMovieController
)

// //get products
router.get("/get-movie", getMovieController)

// //single product
router.get("/get-movie/:slug", getSingleMovieController)

// //get photo
router.get("/movie-photo/:pid", moviePosterController)

router.get("/movie-video/:pid", movieVideoController)

router.get("/movie-trailer/:pid", movieTrailerController)

//search movies
router.get("/search/:keyword", movieSearchController)

//similar movies
router.get("/related-product/:pid/:cid", relatedMovieController)
// //delete rproduct
router.delete("/delete-movie/:pid", deleteMovieController)

router.get("/braintree/token", braintreeTokenController)
router.post("/braintree/payment", requireSignIn, brainTreePaymentController)

module.exports = router
