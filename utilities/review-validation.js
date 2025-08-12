const utilities = require(".")
const { body, validationResult } = require("express-validator") 
const invModel = require("../models/inventory-model")
//Inside the curly braces we can find "body" to access to the data
//Abd validation Result is an object that contains all errors
const validate = {}

/*  **********************************
*  Vehicle Data Validation Rules
* ********************************* */
validate.reviewDataRules = () => {
    return[
    //
    body("review_description")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .notEmpty()
        .withMessage("Please provide a description."),

    // 
    body("review_date")
        .trim()
        .notEmpty(),
        
    // 
    body("account_id")
        .trim()
        .isInt(),

    //
    body("inv_id")
        .trim()
        .isInt()
    ]
}

validate.checkReviewDataRules = async (req, res, next) => {
    const { 
        review_description,
        inv_id
        } = req.body
        
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("message notice", "You must write a comment or review")
        const data = await invModel.getInventoryByCarDetail(inv_id)
        const section = await utilities.buildCarDetailSection(data) // this is in utilities
        let nav = await utilities.getNav()
        const carName = data.inv_year + " " + data.inv_make + " " + data.inv_model
        res.status(501).render("./inventory/detailsCars", {
            title: carName + " vehicle",
            nav,
            section,
            review_description,
            inv_id
    })
    return
  }
  next() // allows the process to continue into the controller for the registration to be carried out.
}

module.exports = validate