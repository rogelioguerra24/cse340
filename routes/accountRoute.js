// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

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
  utilities.handleErrors(accController.accountLogin)
);

router.get("/", 
  utilities.checkLogin,
  utilities.handleErrors(accController.buildManagementView))

module.exports = router;