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

invCont.falseFunction = async function(req, res){
  //const nav = await utilities.getNav() 
  res.render("index", {title: "Home", nav})
}

module.exports = invCont