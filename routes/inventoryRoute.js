// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId",  utilities.handleErrors(invController.buildByClassificationId));

// Route to build details by cars view
// Here we defined the path /detail cause the buildClassificationGrid function that 
// build the path in that way and ":invid" is only to set a variable to be changed
router.get("/detail/:invid",  utilities.handleErrors(invController.buildByCarsDetails));

// This route is only for the error button
router.get("/cause-error",  utilities.handleErrors(invController.falseFunction));

module.exports = router;