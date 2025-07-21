/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const invController = require("./controllers/invController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

/* ***********************
 * "View Engine and Templates"
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
// Details routes, All starts in this part. You must pay attention to the paths
// the following path for detail routes was given by the "a" tag in the Inventorty 
// Building, when you click on the image you will redirec to inv/detail/[id] by
// buildClassificationGrid function so you need to work according this path
// inv is the core path defined by the past functoin
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  let imageError = "class='imageError' src='https://static.vecteezy.com/system/resources/previews/015/645/706/non_2x/two-cars-crash-crashing-into-each-other-s-front-hand-drawn-style-illustration-car-crash-banner-vector.jpg' alt='Car Crashing' width='400px'"
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    imageError
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

/*
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})
*/

//"start" is for production, while "dev" is for development