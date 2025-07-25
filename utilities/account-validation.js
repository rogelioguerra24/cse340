const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator") 
//Inside the curly braces we can find "body" to access to the data
//Abd validation Result is an object that contains all errors
const validate = {}


/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
return [
    // firstname is required and must be string
    body("account_firstname") // This part looks for a name inside the body object
    .trim() //This means sanitizing
    .escape() //This means sanitizing
    .notEmpty() //This means validators
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs // make all words to lowercase
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
        }
    }),

    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({ //By default, the function returns a boolean - True or False.
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),

]
}

/*  **********************************
*  Login Data Validation Rules
* ********************************* */

validate.loginRules = () => {
return [
    body("email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs // make all words to lowercase
    .withMessage("A valid email is required."),
]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
    const { email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            email,
            })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
    })
    return
  }
  next() // allows the process to continue into the controller for the registration to be carried out.
}

module.exports = validate