import { dbConnection } from "../config/db.js";

/**
 * 
 * @param {number} room_id 
 * @returns {Promise<{ id: number, user_id: number, created: Date }?>}
 */
export async function getMessagesForRoom(room_id) {

  const [rows] = await dbConnection
    .promise()
    .query(
      "SELECT (id, user_id, content, created) FROM messages WHERE room_id = ?",
      [room_id]
    );

  if (rows.length === 0) return null;
  console.log(rows);
  return rows.map(row => { row.id, row.user_id, row.content, row.created });

}

/**
 * 
 * @param {string} message 
 * @param {number} sender 
 * @param {number} receiver
 * @param {Date} timestamp
 * @returns {Promise<boolean>}
 */
export async function insertMessage(room_id, user_id, content, timestamp) {
  const [result] = await dbConnection
    .promise()
    .query(
      "INSERT INTO messages (room_id, user_id, content, timestamp) VALUES (?, ?, ?, ?)",
      [room_id, user_id, content, timestamp]
    );
  return result.affectedRows > 0;
}