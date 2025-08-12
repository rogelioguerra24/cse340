const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const revCont = {}

/* ****************************************
*  Add New Review
* *************************************** */
revCont.addNewReview = async function (req, res) {

    const { 
        review_description,
        review_date,
        account_id,
        inv_id
        } = req.body
    

    const addResult = await invModel.addNewReviewCar(
        review_description,
        review_date,
        account_id,
        inv_id
    )

    if (addResult) {
        res.redirect(`/inv/detail/${inv_id}`)
    } else {
        req.flash("notice", "Sorry, the review registration failed.")
        const data = await invModel.getInventoryByCarDetail(inv_id)
        const section = await utilities.buildCarDetailSection(data) // this is in utilities
        let nav = await utilities.getNav()
        const carName = data.inv_year + " " + data.inv_make + " " + data.inv_model
        res.status(501).render("./inventory/detailsCars", {
            title: carName + " vehicle",
            nav,
            section,
            review_description,
    })
    }
}


module.exports = revCont