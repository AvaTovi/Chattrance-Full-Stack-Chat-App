import { dbConnection } from "../config/db.js";

/**
 * 
 * @param {number} id 
 * @returns {Promise<{ id: number, name: string, password: string, created: Date}?>}
 */
export async function getById(id) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT * FROM users WHERE id = ?",
			[id]
		);

	return rows[0] || null;
}

/**
 * 
 * @param {string} name 
 * @returns {Promise<{ id: number, name: string, password: string, created: Date}?>}
 */
export async function getByName(name) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT * FROM users WHERE name = ?",
			[name]
		);

	return rows[0] || null;
}

/**
 * 
 * @param {string} email 
 * @returns {Promise<{ id: number, name: string, password: string, created: Date}?>}
 */
export async function getByEmail(email) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT * FROM users WHERE email = ?",
			[email]
		);

	return rows[0] || null;
}

/**
 * 
 * @param {string} email 
 * @param {string} name 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function create(email, name, password) {
	const [result] = await dbConnection
		.promise()
		.query(
			"INSERT INTO users (email, name, password) VALUES (?, ?, ?)", [
			email,
			name,
			password
		]);
	return result.affectedRows > 0;
}

/**
 * 
 * @param {number} id 
 * @returns {Promise<boolean>}
 */
export async function deleteUser(id) {
	const [result] = await dbConnection
		.promise()
		.query(
			"DELETE FROM users WHERE id = ?",
			[id]
		)
	return result.affectedRows > 0;
}

/**
 * 
 * @param {number} id
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function updatePassword(id, password) {
	const [result] = await dbConnection
		.promise()
		.query(
			"UPDATE users SET password = ? WHERE id = ?",
			[id, password]
		);
	return result.affectedRows > 0;
}

