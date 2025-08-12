const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, hashedPassword){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
  } catch (error) {
    return error.message
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

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using ACCOUNT ID
* ***************************** */
async function getAccountById (account_id){
  try{
    const result = await pool.query(
      "SELECT * FROM account WHERE account_id = $1",
    [account_id])
    return result.rows[0]
  }catch(error){
    return new Error("No matching account id found")
  }
}


/* ***************************
 *  Update Account Data
 * ************************** */
async function updateAccountData(
  account_firstname,
  account_lastname,
  account_email,
  account_id,
) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname  = $2,
          account_email     = $3
      WHERE account_id = $4
      RETURNING *
    `;
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update Account Password
 * ************************** */
async function updateAccountPassword(
  hashedPassword,
  account_id,
) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *
      `;
    const data = await pool.query(sql, [
      hashedPassword,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Get User Reviews
 * ************************** */
async function getAccountReviews(account_id) {
  try {
    const sql = `
      SELECT i.inv_year, i.inv_make, i.inv_model, r.review_date, r.review_id, r.inv_id
      FROM public.review r
      inner join public.inventory i
      ON r.inv_id = i.inv_id
      WHERE r.account_id = $1`
    const data = await pool.query(sql, [account_id])
    return data.rows
  }catch (error){
    console.error("model error: " + error)
  }
}


/* ***************************
 *  Get User Reviews by id
 * ************************** */
async function getReviewsById(review_id) {
  try {
    const sql = `
      SELECT i.inv_year, i.inv_make, i.inv_model, r.review_description, r.review_date, r.review_id, r.inv_id
      FROM public.review r
      inner join public.inventory i
      ON r.inv_id = i.inv_id
      WHERE r.review_id = $1`
    const data = await pool.query(sql, [review_id])
    return data.rows[0]
  }catch (error){
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update Review
 * ************************** */
async function updateReviewData(
  review_description,
  review_date,
  review_id
) {
  try {
    const sql = `
      UPDATE public.review
      SET review_description = $1,
          review_date  = $2
      WHERE review_id = $3
      RETURNING *
    `;
    const data = await pool.query(sql, [
      review_description,
      review_date,
      review_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Review
 * ************************** */


async function deleteReviewById(review_id) {
  const sql = `
      DELETE FROM public.review
      WHERE review_id = $1
    `;
  const data = await pool.query(sql, [review_id])
  return data
}

module.exports = {registerAccount, 
  checkExistingEmail, 
  getAccountByEmail, 
  updateAccountData,
  updateAccountPassword,
  getAccountById,
  getAccountReviews,
  getReviewsById,
  updateReviewData,
  deleteReviewById
}