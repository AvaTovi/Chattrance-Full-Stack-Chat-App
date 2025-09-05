import { dbConnection } from "../config/db.js";

/**
 * 
 * @param {string} user_id 
 * @returns {Promise<{ id: number, name: string }[]?>} conv_id
 */
export async function getAllRooms(user_id) {
  const [rows] = await dbConnection
    .promise()
    .query(
      "SELECT * FROM room_members WHERE user_id = ?",
      [user_id]
    );

  if (rows.length === 0) return null;
  return rows.map(row => { row.id, row.name });
}

/**
 * 
 * @param {number} user_id
 * @param {string?} name
 * @param {string?} password
 * @returns {Promise<number?>} room_id
 */
export async function createRoom(user_id, name, password) {
  const [result] = await dbConnection
    .promise()
    .query(
      "INSERT INTO rooms (name, password) VALUES (?, ?)",
      [name, password]
    );

  const id = result.affectedRows > 0 ? result.insertId : null;

  if (id) {

    const [result] = await dbConnection
      .promise()
      .query(
        "INSERT INTO room_members (room_id, user_id) VALUES (?, ?)",
        [id, user_id]
      );

    if (result.affectedRows > 0) {
      return id;
    } else {
      deleteRoom(id);
    }
  }

  return null;

}

/**
 * 
 * Deletes room associated with id
 * 
 * @param {number} id
 * @return {Promise<boolean?>} success
 */
export async function deleteRoom(id) {

  const [result] = await dbConnection
    .promise()
    .query(
      "DELETE FROM rooms WHERE id = ?",
      [id]
    );

  return result.affectedRows > 0;

}

/**
 * 
 * @param {number} id 
 * @param {number} user_id 
 * @returns {Promise<boolean>}
 */
export async function userIsInRoom(id, user_id) {
  const [rows] = await dbConnection
    .promise()
    .query(
      "SELECT 1 FROM room_members WHERE room_id = ? AND user_id = ?",
      [id, user_id]
    );
  return rows[0] === 1;
}
