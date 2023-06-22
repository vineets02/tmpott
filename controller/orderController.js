// const stripe = require("stripe")(
//   "sk_test_51NIiutSBgJ9qqJc76nOwhfDUIKVw2GR8bWS70cjc9SkpZ25wt9KwMTqPwEBEjegFEThQmECNmZxSlL252kv2M37i00u8Jj0bxV"
// )
// const { v4: uuidv4 } = require("uuid")

// exports.createOrderController = async (req, res) => {
//   const { token, subTotal, currentUser, cartItem } = req.body
//   try {
//     const customer = await stripe.customers.create({
//       email: token.email,
//       source: token.id,
//     })
//     const payment = await stripe.charges.create(
//       {
//         amount: subTotal * 100,
//         currency: "usd",
//         receipt_email: token.email,
//       },
//       {
//         idempotencyKey: uuidv4(),
//       }
//     )
//     if (payment) {
//       res.send("Payment success")
//     } else {
//       res.send("Payment failed")
//     }
//   } catch (error) {
//     res.status(400).json({
//       message: "Something went wrong",
//     })
//   }
// }
// // With these changes, the error in the create route controller should be resolved.
