const express = require("express")
const {
  registerController,
  forgotPasswordController,
  testController,
  loginController,
  getAllUsersController,
  updateSubscriptionController,
  getSingleUser,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} = require("../controller/authController.js")
// const { loginController } = require("../controller/authController.js");
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware.js")
//router object

const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post("/register", registerController)

//LOGIN || POST
router.post("/login", loginController)

//FORGOT PASSWORD || POST
router.post("/forgot-password", forgotPasswordController)
router.get("/users", requireSignIn, isAdmin, getAllUsersController)

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true })
})

router.put("/:_id/subscription", requireSignIn, updateSubscriptionController)

// //test routes
router.get("/test", requireSignIn, isAdmin, testController)
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true })
})

router.get("/users", requireSignIn, isAdmin)
router.get("/users/:id", requireSignIn, isAdmin, getSingleUser)

router.get("/orders", requireSignIn, getOrdersController)
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController)
router.get("/order-status", requireSignIn, isAdmin, orderStatusController)

module.exports = router
