// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const addValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId",  utilities.handleErrors(invController.buildByClassificationId));

// Route to build details by cars view
// Here we defined the path /detail cause the buildClassificationGrid function that 
// build the path in that way and ":invid" is only to set a variable to be changed
router.get("/detail/:invid",  utilities.handleErrors(invController.buildByCarsDetails));

// This route is only for the error button
router.get("/cause-error",  utilities.handleErrors(invController.falseFunction));

//This route is built to handle the add general inventory view
router.get("/", utilities.handleErrors(invController.buildAddInventoryView));

//This route is to handle the add new classifications view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification", 
    addValidate.classificationRules(),
    addValidate.checkAddClassificationData,
    utilities.handleErrors(invController.registerClassification));

//This route is to handle the add new vehicles view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddVehiclePage));

router.post("/add-inventory", 
    addValidate.vehicleRules(),
    addValidate.checkAddVehicleData,
    utilities.handleErrors(invController.registerVehicle));

module.exports = router;