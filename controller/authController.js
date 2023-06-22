const { comparePassword, hashPassword } = require("../helpers/authHelper.js")
const orderModel = require("../models/orderModel.js")
const userModel = require("../models/userModel.js")
const JWT = require("jsonwebtoken")

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, question } = req.body
    //validation
    if (!name) {
      return res.send({ error: "Name is required" })
    }
    if (!email) {
      return res.send({ error: "Email is required" })
    }
    if (!password) {
      return res.send({ error: "Password is required" })
    }
    if (!phone) {
      return res.send({ error: "phone is required" })
    }
    if (!question) {
      return res.send({ error: "question is required" })
    }
    //check user
    const existingUser = await userModel.findOne({ email })
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "already  register please login",
      })
    }
    //register user

    const hashedPassword = await hashPassword(password)
    //save
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      question,
    }).save()
    res.status(201).send({
      success: true,
      message: "user has been registered successfully",
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error while registration",
      error,
    })
  }
}

registerController

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, message: "invalid email  or password" })
    }
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "email not found",
      })
    }
    const match = await comparePassword(password, user.password)
    if (!match)
      return res.status(200).send({
        success: false,
        message: "invalid password",
      })
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    })
    res.status(200).send({
      success: true,
      message: "login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        subscription: user.subscription || false,
      },
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: " Error in login",
      error,
    })
  }
}

const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body
    if (!email) {
      res.status(400).send({ message: "email is required" })
    }
    if (!question) {
      res.status(400).send({ message: "question is required" })
    }
    if (!newPassword) {
      res.status(400).send({ message: "new password is required" })
    }
    //check
    const user = await userModel.findOne({ email, question })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong email and question",
      })
    }
    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id, { password: hashed })
    res.status(200).send({
      success: true,
      message: "password updated successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    })
  }
}

const testController = (req, res) => {
  try {
    res.send("Protected Routes")
  } catch (error) {
    console.log(error)
    res.send({ error })
  }
}

const getAllUsersController = async (req, res) => {
  try {
    const { role } = req.query
    const query = { role: role || 0 }
    const users = await userModel.find(query)
    res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error while fetching users",
      error,
    })
  }
}

const updateSubscriptionController = async (req, res) => {
  try {
    const { _id } = req.params._id

    // Find the user by their ID
    const user = await userModel.findById(_id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Update the subscription status to true
    user.subscription = !user.subscription

    // Save the updated user document
    await user.save()
    const subscriptionStatus = user.subscription ? "active" : "inactive"
    const message = `Subscription status updated successfully. Subscription is now ${subscriptionStatus}.`

    res.json({
      success: true,
      message: message,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// Define the route to get all users
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await userModel.find()

    res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error while fetching users",
      error,
    })
  }
}

const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id

    // Find the user by their ID
    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error while fetching the user",
      error,
    })
  }
}

const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("movies", "-poster")
      .populate("buyer", "name")
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error while getting orders",
      error,
    })
  }
}

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("movies", "-poster")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" })
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error while getting orders",
      error,
    })
  }
}

const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error while updating order status",
      error,
    })
  }
}

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
  getAllUsersController,
  updateSubscriptionController,
  getAllUsers,
  getSingleUser,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
}
