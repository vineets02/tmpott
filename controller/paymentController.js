// const { response } = require("express")
const crypto = require("crypto")
const Razorpay = require("razorpay")

const key_secret = "CjSScVIqY8D2Hvev621SF3bw"

module.exports.orders = (req, res) => {
  let instance = new Razorpay({
    key_id: "rzp_test_9rWvB88vcbBbqM",
    key_secret: "CjSScVIqY8D2Hvev621SF3bw",
  })

  var options = {
    amount: req.body.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    // receipt: "order_rcptid_11",
  }
  instance.orders.create(options, function (err, order) {
    if (err) {
      return res.send({ code: 500, message: "server err" })
    }
    return res.send({ code: 200, message: "order created", data: order })
    // console.log(order)
  })
  //   res.send({ orders })
}

module.exports.verify = (req, res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id

  let expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === req.body.response.razorpay_signature) {
    res.send({ code: 200, message: "Signature valid" })
  } else {
    res.send({ code: 500, message: "Signature notvalid" })
  }
}
