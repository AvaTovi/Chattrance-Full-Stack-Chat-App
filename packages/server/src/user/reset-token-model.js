import { dbConnection } from "../config/db.js";

/**
 * 
 * @param {string} userId 
 * @returns {Promise<Array<{ id: number, token: Buffer, user_id: number, created: Date, expires: Date }>?>}
 */
export async function get(userId) {
  const [rows] = await dbConnection
    .promise()
    .query(
      "SELECT id, token, user_id, expires FROM reset_tokens WHERE user_id = ?",
      [userId],
    );
  return rows.length > 0 ? rows : null;
}

/**
 * 
 * @param {Buffer} token
 * @param {number} userId
 * @param {Date} expires
 * @returns {Promise<boolean>}
 */
export async function create(token, userId, expires) {
  const [result] = await dbConnection
    .promise()
    .query(
      "INSERT (token, user_id, expires) INTO reset_tokens VALUES (?, ?, ?)",
      [token, userId, expires],
    );

  return result.affectedRows === 1;
}

/**
 * 
 * @param {number} userId 
 * @returns {Promise<boolean>}
 */
export async function deleteToken(userId) {

  const [result] = await dbConnection
    .promise()
    .query(
      "DELETE FROM reset_tokens WHERE user_id = ?",
      [userId]
    );

  return result.affectedRows > 0;
}