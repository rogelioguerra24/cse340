const utilities = require(".")
const inventoryModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator") 
//Inside the curly braces we can find "body" to access to the data
//Abd validation Result is an object that contains all errors
const validate = {}

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return[
        // classifiaction name is required and must be only alphabetic
        body("classification_name")
        .trim() //This means sanitizing
        .escape() //This means sanitizing
        .notEmpty() //This means validators
        .isLength({ min: 1 })
        .matches(/^[A-Za-z]+$/)
        .withMessage("Please provide a classification name."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
    })
    return
  }
  next() // allows the process to continue into the controller for the registration to be carried out.
}

/*  **********************************
*  Vehicle Data Validation Rules
* ********************************* */
validate.vehicleRules = () => {
    return[
    // classification_id must not be empty and must be numeric 
    body("classification_id")
        .notEmpty()
        .withMessage("Please select a classification.")
        .isInt()
        .withMessage("Classification ID must be a number."),

    // inv_make - only letters and spaces
    body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a make.")
        .matches(/^[A-Za-z ]+$/)
        .withMessage("Make must contain only letters and spaces."),

    // inv_model - only letters and spaces
    body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a model.")
        .matches(/^[A-Za-z ]+$/)
        .withMessage("Model must contain only letters and spaces."),

    // inv_description - required
    body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a description."),

    // inv_image - must match valid path format
    body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Please provide an image path.")
        .matches(/^\/images\/vehicles\/[a-zA-Z0-9_-]+\.(jpg|png|jpeg|gif)$/)
        .withMessage("Image path must start with /images/vehicles/ and end in .jpg, .png, .jpeg, or .gif."),

    // inv_thumbnail - same rule as inv_image
    body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Please provide a thumbnail path.")
        .matches(/^\/images\/vehicles\/[a-zA-Z0-9_-]+\.(jpg|png|jpeg|gif)$/)
        .withMessage("Thumbnail path must start with /images/vehicles/ and end in .jpg, .png, .jpeg, or .gif."),

    // inv_price - must be a positive number
    body("inv_price")
        .notEmpty()
        .withMessage("Please provide a price.")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number."),

    // inv_year - must be between 1900 and 2099
    body("inv_year")
        .notEmpty()
        .withMessage("Please provide the year.")
        .isInt({ min: 1900, max: 2099 })
        .withMessage("Year must be between 1900 and 2099."),

    // inv_miles - must be a positive number
    body("inv_miles")
        .notEmpty()
        .withMessage("Please provide the miles.")
        .isInt({ min: 0 })
        .withMessage("Miles must be a positive number."),

    // inv_color - only letters and spaces
    body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a color.")
        .matches(/^[A-Za-z ]+$/)
        .withMessage("Color must contain only letters and spaces.")
    ]
}

/*  **********************************
*  CheckVehicle Data Validation Rules
* ********************************* */
validate.checkAddVehicleData = async (req, res, next) => {
    const { 
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
        } = req.body
    
    let errors = []
    errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
    })
    return
  }
  next() // allows the process to continue into the controller for the registration to be carried out.
}


module.exports = validate