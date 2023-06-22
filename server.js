const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const morgan = require("morgan")
const authRoutes = require("./routes/authRoute")
const categoryRoutes = require("./routes/categoryRoutes")
const contentTypeRoutes = require("./routes/contentTypeRoutes")
const advisoryRoutes = require("./routes/advisoryRoutes")
const movieRoutes = require("./routes/movieRoutes")
const paymentController = require("./controller/paymentController")
const path = require("path")
// const orderRoute = require("./routes/orderRoute")
const stripe = require("stripe")(
  "sk_test_51NIiutSBgJ9qqJc76nOwhfDUIKVw2GR8bWS70cjc9SkpZ25wt9KwMTqPwEBEjegFEThQmECNmZxSlL252kv2M37i00u8Jj0bxV"
)

const YOUR_DOMAIN = "http://localhost:8080"
const cors = require("cors")
const movieModel = require("./models/movieModel")

const getMovieData = async () => {
  try {
    const movies = await Movie.find()
    // Map the movie data to line items
    const lineItems = movies.map((movie) => ({
      price: movie.price,
      quantity: 1,
    }))

    return lineItems
  } catch (error) {
    console.error("Error retrieving movie data:", error)
    return []
  }
}
//config env
dotenv.config()
//database config
connectDB()

//rest object
const app = express()

//middleware
app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "./client/build")))

//routes
app.use(cors())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/content-type", contentTypeRoutes)
app.use("/api/v1/content-advisory", advisoryRoutes)
app.use("/api/v1/movie", movieRoutes)
// app.use("/api/v1/orders", orderRoute)
// app.use("/api/v1/users", getAllUsersController)

//rest api
// app.get("/", (req, res) => {
//   res.send({
//     message: "welcome to tmpott app",
//   })
// })

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"))
})

app.post("/orders", paymentController.orders)
app.post("/verify", paymentController.verify)
app.post("/create-checkout-session", async (req, res) => {
  try {
    // Retrieve movie data from the database
    const lineItems = await getMovieData()

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    })

    res.redirect(303, session.url)
  } catch (error) {
    console.error("Error creating checkout session:", error)
    res.status(500).json({ error: "Failed to create checkout session" })
  }
})

// app.post("/create-portal-session", async (req, res) => {
//   // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
//   // Typically this is stored alongside the authenticated user in your database.
//   const { session_id } = req.body
//   const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)

//   // This is the url to which the customer will be redirected when they are done
//   // managing their billing with the portal.
//   const returnUrl = YOUR_DOMAIN

//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: checkoutSession.customer,
//     return_url: returnUrl,
//   })

//   res.redirect(303, portalSession.url)
// })

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   (request, response) => {
//     let event = request.body
//     // Replace this endpoint secret with your endpoint's unique secret
//     // If you are testing with the CLI, find the secret by running 'stripe listen'
//     // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
//     // at https://dashboard.stripe.com/webhooks
//     const endpointSecret = "whsec_12345"
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//       // Get the signature sent by Stripe
//       const signature = request.headers["stripe-signature"]
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature,
//           endpointSecret
//         )
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message)
//         return response.sendStatus(400)
//       }
//     }
//     let subscription
//     let status
//     // Handle the event
//     switch (event.type) {
//       case "customer.subscription.trial_will_end":
//         subscription = event.data.object
//         status = subscription.status
//         console.log(`Subscription status is ${status}.`)
//         // Then define and call a method to handle the subscription trial ending.
//         // handleSubscriptionTrialEnding(subscription);
//         break
//       case "customer.subscription.deleted":
//         subscription = event.data.object
//         status = subscription.status
//         console.log(`Subscription status is ${status}.`)
//         // Then define and call a method to handle the subscription deleted.
//         // handleSubscriptionDeleted(subscriptionDeleted);
//         break
//       case "customer.subscription.created":
//         subscription = event.data.object
//         status = subscription.status
//         console.log(`Subscription status is ${status}.`)
//         // Then define and call a method to handle the subscription created.
//         // handleSubscriptionCreated(subscription);
//         break
//       case "customer.subscription.updated":
//         subscription = event.data.object
//         status = subscription.status
//         console.log(`Subscription status is ${status}.`)
//         // Then define and call a method to handle the subscription update.
//         // handleSubscriptionUpdated(subscription);
//         break
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`)
//     }
//     // Return a 200 response to acknowledge receipt of the event
//     response.send()
//   }
// )

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`server Running on ${PORT}`.bgYellow.white)
})
