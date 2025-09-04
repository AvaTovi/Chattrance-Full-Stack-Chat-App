import { dbConnection } from "../config/db.js";

/**
 * 
 * @param {string} message 
 * @param {number} sender 
 * @param {number} receiver
 * @param {Date} timestamp
 * @returns {Promise<number>}
 */
export async function insertMessage(sender, receiver, message, timestamp) {
  const [result] = await dbConnection
    .promise()
    .query(
      "INSERT INTO messages (send_id, recv_id, content, created_at) VALUES (?, ?, ?, ?)",
      [sender, receiver, message, timestamp]
    );
  return result.insertId;
}

/**
 * 
 * @param {string} user_id 
 * @returns {Promise<number?>} conv_id
 */
export async function getConversation(user_one, user_two) {
  const [rows] = await dbConnection
    .promise()
    .query(
      "SELECT * FROM conversations WHERE user_one = LEAST(?, ?) AND user_two = GREATEST(?, ?)",
      [user_one, user_two, user_one, user_two]
    );

  if (rows.length === 0) return null;
  return rows[0].conv_id;
}

/**
 * 
 * @param {number} user_id
 * @returns {Promise<number[]>}
 */
export async function getAllConversations(user_id) {
  const [rows] = await dbConnection
    .promise()
    .query(
      "SELECT * FROM conversations WHERE user_one = ? OR user_two = ?",
      [user_id, user_id]
    );
  return rows.map(row => row.conv_id);
}

/**
 * 
 * @param {number} user_one 
 * @param {number} user_two 
 * @returns {Promise<number>} conv_id
 */
export async function createConversation(user_one, user_two) {
  const [result] = await dbConnection
    .promise()
    .query(
      "INSERT INTO conversations (user_one, user_two) VALUES (LEAST(?, ?), GREATEST(?, ?))",
      [user_one, user_two, user_one, user_two]
    );
  return result.insertId;
}