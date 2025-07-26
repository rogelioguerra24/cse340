const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {//this is a method
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  })
}

/* ***************************
 *  Build Card Details page with EJS
 * ************************** */
invCont.buildByCarsDetails = async function (req, res, next) {//this is a method
  const inv_id = req.params.invid
  const data = await invModel.getInventoryByCarDetail(inv_id)
  const section = await utilities.buildCarDetailSection(data) // this is in utilities
  let nav = await utilities.getNav()
  const carName = data.inv_year + " " + data.inv_make + " " + data.inv_model
  res.render("./inventory/detailsCars", {
    title: carName + " vehicle",
    nav,
    section
  })
}

/* ***************************
 *  This function id for the Link 500 error test
 * ************************** */
invCont.falseFunction = async function(req, res){
  //const nav = await utilities.getNav() 
  res.render("index", {title: "Home", nav})
}

/* ***************************
 *  Build Add General Inventory View
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Add Classification Page
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Register New Classification
* *************************************** */
invCont.registerClassification = async function (req, res) {
  
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(
    classification_name
  )

  if (addResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you have registered a new Classification. Please try it.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build Add Vehicle Page
 * ************************** */
invCont.buildAddVehiclePage = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    errors: null,
    classificationList
  })
}

/* ****************************************
*  Register New Vehicle
* *************************************** */
invCont.registerVehicle = async function (req, res) {
  
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

  const addResult = await invModel.addVehicle(
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
  )

  if (addResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you have registered a new Vehicle. Please take a look.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors: null,  
    })
  }
}

module.exports = invCont