const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get Specific Car Detail according to the path
 * ************************** */
async function getInventoryByCarDetail(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getcardetails error " + error)
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Add a new Classification
 * ********************* */
async function addClassification(classification_name) {
  try{
    const sql = "INSERT INTO classification(classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch(error){
    return error.message
  }
}

/* **********************
 *   Add a new Vehicle to the inventory
 * ********************* */
async function addVehicle(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color) {
  try{
    const sql = `INSERT INTO inventory(
    classification_id, 
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [
      classification_id, 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color])
  } catch(error){
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
 async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

/* ***************************
 *  Add new Review to Car
 * ************************** */
 async function addNewReviewCar(
  review_description,
  review_date,
  account_id,
  inv_id
) {
  try {
    const sql = `INSERT INTO public.review 
    (review_description, review_date, account_id, inv_id) VALUES 
    ($1, $2, $3, $4) RETURNING *;`
  return await pool.query(sql, [
      review_description,
      review_date,
      account_id,
      inv_id])
  } catch (error) {
    new Error("Add review Error")
  }
}

/* ***************************
 *  Display Reviews in the Cars Details page
 * ************************** */
async function getReviewsList(inv_id) {
  try{
    const sql = `SELECT 
    r.review_id, 
    r.review_date, 
    r.review_description, 
    a.account_firstname  
      FROM public.review r
      INNER JOIN public.account a
      ON r.account_id = a.account_id
      WHERE r.inv_id = $1
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch(error){
    new Error("Get review Error")
  }
}


module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryByCarDetail, 
  checkExistingEmail,
  addClassification,
  addVehicle,
  updateInventory,
  deleteInventory,
  addNewReviewCar,
  getReviewsList
};