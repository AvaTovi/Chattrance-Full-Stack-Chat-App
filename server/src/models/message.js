import { dbConnection } from "../db.js";

import { MESSAGE_SIZE } from "../utils/constants.js";

/**
 * 
 * @param {string} message 
 * @param {number} sender 
 * @param {number} receiver
 * @returns {Promise<boolean>}
 */
export async function insertMessage(sender, receiver, message) {
  const [rows] = await dbConnection
    .promise()
    .query(
      "INSERT INTO messages (send_id, recv_id, content) VALUES (?, ?, ?)",
      [sender, receiver, message]
    );
  return rows.affectedRows > 0;
}