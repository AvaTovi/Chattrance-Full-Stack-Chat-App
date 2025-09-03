import bcrypt from "bcryptjs";

import { dbConnection } from "../config/db.js";
import { SALT_ROUNDS } from "../utils/constants.js";

/**
 * 
 * @param {string} email 
 * @param {string} name 
 * @returns {Promise<boolean>}
 */
export async function isUserTaken(email, name) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT 1 FROM users WHERE email = ? OR name = ? LIMIT 1",
			[email, name]
		);
	return rows.length > 1;
}

/**
 * 
 * @param {string} email 
 * @returns {Promise<number?>}
 */
export async function findUserByEmail(email) {
	const [rows] = await dbConnection
		.promise()
		.query("SELECT id FROM users WHERE email = ?", [email]);
	return rows[0] || null;
}

/**
 * 
 * @param {string} email 
 * @param {string} name 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function createUser(email, name, password) {
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const [result] = await dbConnection
		.promise()
		.query(
			"INSERT INTO users (email, name, password) VALUES (?, ?, ?)", [
			email,
			name,
			hashedPassword
		]);
	return result.affectedRows > 0;
}

/**
 * 
 * @param {string} name 
 * @param {string} password 
 * @returns {Promise<{ id: number, email: string, name: string }?>}
 */
export async function authenticateUser(name, password) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT id, email, password FROM users WHERE name = ?",
			[name]
		);

	const user = rows[0];
	if (!user) return null;
	const { id, email, password: hashedPassword } = user;

	const isMatch = await bcrypt.compare(password, hashedPassword);
	return isMatch ? { id, email, name } : null;
}

/**
 * 
 * @param {number} id
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function updatePassword(id, password) {
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const [result] = await dbConnection
		.promise()
		.query("UPDATE users SET password = ? WHERE id = ?", [
			hashedPassword,
			id,
		]);
	return result.affectedRows > 0;
}

