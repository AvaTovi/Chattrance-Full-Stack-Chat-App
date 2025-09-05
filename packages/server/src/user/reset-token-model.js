import { dbConnection } from "../config/db.js";

/**
 * 
 * @param {string} user_id 
 * @returns {Promise<{ token: string, user_id: number, created: Date, expires: Date }?>}
 */
export async function get(user_id) {
  const [rows] = await dbConnection
    .promise()
    .query(
      "SELECT * WHERE user_id = ?",
      [user_id],
    );
  return rows[0] || null;
}

/**
 * 
 * @param {string} token
 * @param {number} user_id
 * @param {Date} created
 * @param {Date} expires
 * @returns {Promise<boolean>}
 */
export async function create(token, user_id, created, expires) {

  const [result] = await dbConnection
    .promise()
    .query(
      `
      INSERT INTO reset_tokens (token, user_id, created, expires) VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      token = VALUES(token),
      created = VALUES(created),
      expires = VALUES(expires)
      `,
      [token, user_id, created, expires],
    );

  return result.affectedRows > 0;
}

/**
 * 
 * @param {number} user_id 
 * @returns {Promise<boolean>}
 */
export async function deleteToken(user_id) {

  const [result] = await dbConnection
    .promise()
    .query(
      "DELETE FROM reset_tokens WHERE user_id = ?",
      [user_id]
    );

  return result.affectedRows > 0;
}