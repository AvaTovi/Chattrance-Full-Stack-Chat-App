import { dbConnection } from "../config/db.js";

/**
 * 
 * @param {number} userId 
 * @returns {Promise<Array<{ id: number, name: string?, password: string?, owner: number, created: Date }>?>}
 */
export async function getRoomsByUserId(userId) {
  const [rows] = await dbConnection
    .promise()
    .query(`
      SELECT r.id, r.name, r.password, r.owner, r.created
      FROM rooms r
      INNER JOIN room_members rm ON r.id = rm.room_id
      WHERE rm.user_id = ?
      `,
      [userId]
    );
  return rows.length > 0 ? rows : null;
}

/**
 * @param {number} roomId
 * @return {Promise<{id: number, name: string, owner: number, password: string?, created: Date}?>}
 */
export async function getRoomById(roomId) {
  const [rows] = await dbConnection
    .promise()
    .query(
      "SELECT id, name, owner, password, created FROM rooms WHERE id = ?",
      [roomId]
    );
  return rows[0] ?? null;
}

/**
 * 
 * @param {string?} name
 * @param {string?} password
 * @param {number} owner
 * @returns {Promise<number?>}
 */
export async function create(name, password, owner) {

  const connection = await dbConnection.promise().getConnection();

  try {

    await connection.beginTransaction();

    const [roomResult] = await connection.query(
      "INSERT INTO rooms (name, password, owner) VALUES (?, ?, ?)",
      [name, password, owner]
    );

    const room_id = roomResult.affectedRows === 1 ? roomResult.insertId : null;

    if (!room_id) {

      await connection.rollback();
      connection.release();
      return null;
    }

    const [memberResult] = await connection.query(
      "INSERT INTO room_members (room_id, user_id) VALUES (?, ?)",
      [room_id, owner]
    );

    if (memberResult.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return null;
    }

    await connection.commit();
    connection.release();

    return room_id;

  } catch (err) {

    await connection.rollback();
    connection.release();
    throw err;

  }

}

/**
 * 
 * @param {number} roomId 
 * @param {number} userId 
 * @returns {Promise<boolean>}
 */
export async function insertRoomMember(roomId, userId) {

  const [result] = await dbConnection
    .promise()
    .query(
      "INSERT IGNORE INTO room_members (room_id, user_id) VALUES (?, ?)",
      [roomId, userId]
    );

  return result.affectedRows === 1;

}

/**
 * 
 * Deletes room associated with id
 * 
 * @param {number} roomId
 * @return {Promise<boolean>} success
 */
export async function deleteRoom(roomId) {

  const [result] = await dbConnection
    .promise()
    .query(
      "DELETE FROM rooms WHERE id = ?",
      [roomId]
    );

  return result.affectedRows === 1;

}

/**
 * 
 * @param {number} roomId 
 * @param {string} name 
 */
export async function updateName(roomId, name) {
  const [result] = await dbConnection
    .promise()
    .query(
      "UPDATE rooms SET name = ? WHERE id = ?",
      [name, roomId]
    );

  return result.affectedRows === 1;

}

/**
 * 
 * @param {number} roomId 
 * @param {string?} password 
 */
export async function updatePassword(roomId, password) {
  const [result] = await dbConnection
    .promise()
    .query(
      "UPDATE rooms SET password = ? WHERE id = ?",
      [password, roomId]
    );
  return result.affectedRows === 1;
}
