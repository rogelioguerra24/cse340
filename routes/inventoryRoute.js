// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const addValidate = require("../utilities/inventory-validation")
const regValidate = require('../utilities/account-validation')
const revValidation = require('../utilities/review-validation')
const revController = require('../controllers/reviewController')

// Route to build inventory by classification view
router.get("/type/:classificationId",  utilities.handleErrors(invController.buildByClassificationId));

// Route to build details by cars view
// Here we defined the path /detail cause the buildClassificationGrid function that 
// build the path in that way and ":invid" is only to set a variable to be changed
router.get("/detail/:invid",  utilities.handleErrors(invController.buildByCarsDetails));

// This route is only for the error button
router.get("/cause-error",  utilities.handleErrors(invController.falseFunction));

//This route is built to handle the add general inventory view
router.get("/", 
    regValidate.accountAdminEmployeeType,
    utilities.handleErrors(invController.buildAddInventoryView));

//This route is to handle the add new classifications view
router.get("/add-classification", 
    regValidate.accountAdminEmployeeType,
    utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification", 
    addValidate.classificationRules(),
    addValidate.checkAddClassificationData,
    utilities.handleErrors(invController.registerClassification));

//This route is to handle the add new vehicles view
router.get("/add-inventory", 
    regValidate.accountAdminEmployeeType,
    utilities.handleErrors(invController.buildAddVehiclePage));

router.post("/add-inventory", 
    addValidate.vehicleRules(),
    addValidate.checkAddVehicleData,
    utilities.handleErrors(invController.registerVehicle));

//This route is for handing the getinventory process
router.get("/getInventory/:classification_id", 
    utilities.handleErrors(invController.getInventoryJSON));

//This route is for the update page view both get and post
router.get("/edit/:inv_id", 
    regValidate.accountAdminEmployeeType,
    utilities.handleErrors(invController.editInventoryView));
router.post("/update/", 
    addValidate.newInventoryRules(),
    addValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

//This routes are made for handling the deletion process of an item 
router.get("/delete/:inv_id", 
    regValidate.accountAdminEmployeeType,
    utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))


//This route is for the form of each car 
router.post("/review/",
    revValidation.reviewDataRules(),
    revValidation.checkReviewDataRules,
    utilities.handleErrors(revController.addNewReview)
)

module.exports = router;