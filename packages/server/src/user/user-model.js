import { dbConnection } from "../config/db.js";

/**
 * 
 * @param {number} userId 
 * @returns {Promise<{ id: number, email: string, name: string, password: string, created: Date }?>}
 */
export async function getById(userId) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT id, email, name, password, created FROM users WHERE id = ?",
			[userId]
		);

	return rows[0] ?? null;
}

/**
 * 
 * @param {string} username
 * @returns {Promise<{ id: number, email: string, name: string, password: string, created: Date }?>}
 */
export async function getByName(username) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT id, email, name, password, created FROM users WHERE name = ?",
			[username]
		);

	return rows[0] ?? null;
}

/**
 * 
 * @param {string} email 
 * @returns {Promise<{ id: number, email: string, name: string, password: string, created: Date }?>}
 */
export async function getByEmail(email) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT id, email, name, password, created FROM users WHERE email = ?",
			[email]
		);

	return rows[0] ?? null;
}

/**
 * 
 * @param {string} email 
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function create(email, username, password) {
	const [result] = await dbConnection
		.promise()
		.query(
			"INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
			[email, username, password]);
	return result.affectedRows === 1;
}

/**
 * 
 * @param {number} userId 
 * @returns {Promise<boolean>}
 */
export async function deleteUser(userId) {
	const [result] = await dbConnection
		.promise()
		.query(
			"DELETE FROM users WHERE id = ?",
			[userId]
		)
	return result.affectedRows === 1;
}

/**
 * 
 * @param {number} userId 
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export async function updateEmail(userId, email) {
	const [result] = await dbConnection
		.promise()
		.query(
			"UPDATE users SET email = ? WHERE id = ?",
			[userId, email]
		);
	return result.affectedRows === 1;
}

/**
 * 
 * @param {number} userId
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function updatePassword(userId, password) {
	const [result] = await dbConnection
		.promise()
		.query(
			"UPDATE users SET password = ? WHERE id = ?",
			[userId, password]
		);
	return result.affectedRows === 1;
}

