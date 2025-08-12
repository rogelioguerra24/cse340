const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator") 
//Inside the curly braces we can find "body" to access to the data
//Abd validation Result is an object that contains all errors
const validate = {}
const jwt = require("jsonwebtoken");

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
    body("account_email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("A valid email is required.")
]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
    const { account_email } = req.body
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
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

validate.accountAdminEmployeeType = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        { audience: ["Admin", "Employee"] // Lists allowed
        },
        function (err, accountData) {
        if (err) {
            req.flash("Please log in")
            res.clearCookie("jwt")
            return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
       })
     } else {
        req.flash("message notice", "You must be an Admin or employee to access. Please log in")
        res.locals.accountData = null
        return res.redirect("/account/login")
    }
};

/*  **********************************
*  Update Data Validation Rules
* ********************************* */
validate.updateAccountDataRules = () => {
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
    .custom(async (account_email, { req }) => {
    const existingAccount = await accountModel.getAccountByEmail(account_email)

        // If email exists but belongs to *this* account, allow it
        if (existingAccount && existingAccount.account_id != req.body.account_id) {
        throw new Error("Email exists. Please log in or use a different email.")
        }
    }),

    // valid id is required
    body("account_id")
        .trim()
        .isInt(),
]
}

validate.checkUpdateAccountData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update-view", {
            errors,
            title: "Edit Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id
    })
    return
  }
  next() // allows the process to continue into the controller for the registration to be carried out.
}


/*  **********************************
*  Update Password Validation Rules
* ********************************* */
validate.updatePasswordDataRules = () => {
return [
    // firstname is required and must be string
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


    // valid id is required
    body("account_id")
        .trim()
        .isInt(),
]
}

validate.checkUpdatePasswordData = async (req, res, next) => {
    const { account_password, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update-view", {
            errors,
            title: "Edit Account",
            nav,
            account_password,
            account_id
    })
    return
  }
  next() // allows the process to continue into the controller for the registration to be carried out.
}

validate.updateReviewRules = () => {
return [
    // firstname is required and must be string
    body("review_description")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .notEmpty()
        .withMessage("Please provide a description."),

    body("review_date")
        .trim()
        .notEmpty()
        .withMessage("Review date is required"),

    // valid id is required
    body("review_id")
        .trim()
        .isInt(),
]
}

validate.checkUpdateReview = async (req, res, next) => {
    const { review_description,
    review_date,
    review_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("message notice", `Dont forget to write a review`)
        const data = await accountModel.getReviewsById(review_id)
        let nav = await utilities.getNav()
        res.render("review/update-review", {
            errors,
            title: "Edit "+ data.inv_year +" "+ data.inv_make +" "+ data.inv_model +" Review",
            nav,
            review_description,
            review_date,
            review_id
    })
    return
  }
  next() // allows the process to continue into the controller for the registration to be carried out.
}

module.exports = validate