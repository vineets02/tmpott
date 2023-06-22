const express = require("express")
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware.js")
const {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} = require("../controller/categoryController.js")

const router = express.Router()

// Routes
// Create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
)

// Update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
)

// Get all categories
router.get("/get-category", categoryController)

// Single category
router.get("/single-category/:slug", singleCategoryController)

// Delete category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
)

module.exports = router
