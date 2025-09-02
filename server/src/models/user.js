import bcrypt from "bcryptjs";
import crypto from "crypto";

import { dbConnection } from "../db.js";
import { SALT_ROUNDS, TOKEN_LIFETIME, TOKEN_SIZE } from "../utils/constants.js";

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
	return rows.length > 0;
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
			"SELECT id, email, name, password FROM users WHERE name = ?",
			[name]
		);

	const user = rows[0];
	if (!user) return null;
	const { id, email, name, password: hash } = user;

	const isMatch = await bcrypt.compare(password, hash);
	return isMatch ? { id, email, name } : null;
}

/**
 * 
 * @param {string} user_id 
 * @returns { Promise<string?> }
 */
export async function insertResetToken(user_id) {
	const prevToken = await getPasswordResetToken(user_id);
	if (prevToken && Date.now() - new Date(prevToken.created).getTime() < TOKEN_LIFETIME) {
		return null;
	}
	const plainToken = crypto.randomBytes(TOKEN_SIZE).toString("hex");
	const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");
	const createdAt = new Date();
	const expiresAt = new Date(Date.now() + TOKEN_LIFETIME);
	await dbConnection
		.promise()
		.query(
			`
			INSERT INTO reset_tokens (token, user_id, created, expires) VALUES (?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE
			token = VALUES(token),
			created = VALUES(created),
			expires = VALUES(expires)
			`,
			[hashedToken, user_id, createdAt, expiresAt],
		);
	return plainToken;
}

/**
 * 
 * @param {string} user_id 
 * @returns {Promise<{ token: string, created: Date, expires: Date }?>}
 */
async function getPasswordResetToken(user_id) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT token, created, expires from reset_tokens WHERE user_id = ? AND expires > NOW()",
			[user_id],
		);
	return rows[0] || null;
}

/**
 * 
 * @param {string} user_id
 */
export async function deleteResetToken(user_id) {
	await dbConnection
		.promise()
		.query("DELETE FROM reset_tokens WHERE user_id = ?", [user_id]);
}

/**
 * 
 * @param {string} user_id 
 * @param {string} plain_token 
 * @returns {Promise<boolean>}
 */
export async function verifyResetToken(user_id, plain_token) {
	const record = await getPasswordResetToken(user_id);
	if (!record) { return false };
	const checkToken = crypto.createHash("sha256").update(plain_token).digest("hex");
	return checkToken === record.token;
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
