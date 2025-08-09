//Require elements
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "There is not data as this")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000, audience: accountData.account_type})
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver Management view
* *************************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav()
  
  req.flash("notice", 'You are logged in')
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null
  })

}

async function buildAccountEditView(req, res, next) {
  const accountInfo = res.locals.accountData
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(accountInfo.account_id)
   res.render("account/update-view", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname : accountData.account_firstname,
    account_lastname : accountData.account_lastname,
    account_email: accountData.account_email,
    account_id : accountData.account_id
  })
}

/* ****************************************
*  Process Update Data Account
* *************************************** */
 async function updateAccount (req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body

  const updateResult = await accountModel.updateAccountData(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    req.flash("message notice", `Your account has been updated. Congratulations!`)
    res.redirect("/account/")
  } else {
    req.flash("message notice", "Sorry, the insert failed.")
    res.status(501).render("account/update-view", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

/* ****************************************
*  Process Update Password Account
* *************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Validate password
  if (!account_password || account_password.length < 8) {
    req.flash("notice", "Password must be at least 8 characters long.")
    return res.status(400).render("account/update-view", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const updateResult = await accountModel.updateAccountPassword(
      hashedPassword,
      account_id
    )

    if (updateResult) {
      req.flash("notice", "Your password has been updated. Congratulations!")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the password update failed.")
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Sorry, there was an error processing your request.")
  }

  res.status(500).render("account/update-view", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id
  })
}


module.exports = { buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountEditView,
  buildManagementView,
updateAccount,
updatePassword}