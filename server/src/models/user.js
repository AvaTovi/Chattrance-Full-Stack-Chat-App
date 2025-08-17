import bcrypt from "bcryptjs";
import crypto from "crypto";

import { dbConnection } from "../db.js";
import { SALT_ROUNDS, TOKEN_LIFETIME, TOKEN_SIZE } from "../utils/constants.js";

/**
 * 
 * @param {string} username 
 * @param {string} email 
 * @returns {Promise<Array<{ user_id: number, username: string, email: string }>>}
 */
async function findByUsernameOrEmail(username, email) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT user_id, username, email FROM users WHERE username = ? OR email = ?",
			[username, email],
		);
	return rows;
}

/**
 * 
 * @param {string} username 
 * @returns {Promise<{ user_id: number, username: string, password: string, email: string, created_at: Date } | null>}
 */
async function findByUsername(username) {
	const [rows] = await dbConnection
		.promise()
		.query("SELECT * FROM users WHERE username = ?", [username]);
	return rows[0] || null;
}

/**
 * 
 * @param {string} email 
 * @returns {Promise<{ user_id: string } | null>}
 */
export async function findByEmail(email) {
	const [rows] = await dbConnection
		.promise()
		.query("SELECT user_id FROM users WHERE email = ?", [email]);
	return rows[0] || null;
}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 * @returns {Promise<boolean>}
 */
export async function createUser(username, password, email) {
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const createdAt = new Date();
	const [result] = await dbConnection
		.promise()
		.query("INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, ?)", [
			username,
			hashedPassword,
			email,
			createdAt
		]);
	return result.affectedRows > 0;
}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{ user_id: number, username: string, email: string } | null>}
 */
export async function authenticateUser(username, password) {
	const user = await findByUsername(username);
	if (!user) return null;
	const isMatch = await bcrypt.compare(password, user.password);
	return isMatch ? { user_id: user.user_id, username: user.username, email: user.email } : null;
}

/**
 * 
 * @param {string} username 
 * @param {string} email 
 * @returns {Promise<boolean>}
 */
export async function isUserTaken(username, email) {
	const users = await findByUsernameOrEmail(username, email);
	return users.length > 0;
}


/**
 * 
 * @param {string} user_id 
 * @returns { Promise<string | null> }
 */
export async function insertResetToken(user_id) {
	const prevToken = await getPasswordResetToken(user_id);
	if (prevToken && Date.now() - new Date(prevToken.created_at).getTime() < TOKEN_LIFETIME) {
		return null;
	}
	const plainToken = crypto.randomBytes(TOKEN_SIZE).toString("hex");
	const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");
	const createdAt = new Date();
	const expiresAt = new Date(Date.now() + TOKEN_LIFETIME);
	await dbConnection
		.promise()
		.query(
			"INSERT INTO reset_tokens (token, created_at, expires_at, user_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token), created_at = VALUES(created_at), expires_at = VALUES(expires_at)",
			[hashedToken, createdAt, expiresAt, user_id],
		);
	return plainToken;
}

/**
 * 
 * @param {string} user_id 
 * @returns {Promise<{ user_id: number, username: string, email: string } | null>}
 */
async function getPasswordResetToken(user_id) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT token, created_at, expires_at from reset_tokens WHERE user_id = ? AND expires_at > NOW()",
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
	const checkToken = crypto.createHash("sha256").update(plain_token).digest("hex");
	if (!record) { return false };
	return checkToken === record.token;
}

/**
 * 
 * @param {string} user_id 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export async function updatePassword(user_id, password) {
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const [result] = await dbConnection
		.promise()
		.query("UPDATE users SET password = ? WHERE user_id = ?", [
			hashedPassword,
			user_id,
		]);
	return result.affectedRows > 0;
}
