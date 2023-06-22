const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel.js")

// Protected Routes token base
exports.requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodedToken
    next()
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Invalid token" })
  }
}

// Admin access
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id)
    if (user.role !== 1) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      })
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      success: false,
      error,
      message: "Error in admin middleware",
    })
  }
}
