// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const validate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accController.buildLogin));

router.get("/registration", utilities.handleErrors(accController.buildRegister));

router.post('/register',
  regValidate.registationRules(),
  regValidate.checkRegData, 
  utilities.handleErrors(accController.registerAccount));

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.checkJWTToken, // I made this line
  utilities.handleErrors(accController.accountLogin)
);

router.get("/", 
  utilities.checkLogin,
  utilities.handleErrors(accController.buildManagementView))

//This is the route for log out
router.get("/logout", (req, res) => {
    res.clearCookie("jwt"); // Name of your cookie
    utilities.handleErrors(res.redirect("/"));
});

//This new route is for developing the edit account data
router.get("/edit-account/", 
  utilities.handleErrors(accController.buildAccountEditView)
)
router.post("/update-account",
  validate.updateAccountDataRules(),
  validate.checkUpdateAccountData,
  utilities.handleErrors(accController.updateAccount)
)
router.post("/update-password",
  validate.updatePasswordDataRules(),
  validate.checkUpdatePasswordData,
  utilities.handleErrors(accController.updatePassword)
)


module.exports = router;