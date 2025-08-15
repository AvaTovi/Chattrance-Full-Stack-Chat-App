import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { dbConnection } from "../db";
import { SALT_ROUNDS, TOKEN_LIFETIME, TOKEN_SIZE } from "../utils/constants";

dotenv.config();

export async function findByUsername(username) {
	const [rows] = await dbConnection
		.promise()
		.query("SELECT * FROM users WHERE username = ?", [username]);
	return rows[0] || null;
}

async function findByUsernameOrEmail(username, email) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT id, username, email FROM users WHERE username = ? OR email = ?",
			[username, email],
		);
	return rows;
}

export async function findByEmail(email) {
	const [rows] = await dbConnection
		.promise()
		.query("SELECT id, email FROM users WHERE email = ?", [email]);
	return rows[0] || null;
}

export async function createUser(username, password, email) {
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const [result] = await dbConnection
		.promise()
		.query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", [
			username,
			hashedPassword,
			email,
		]);
	return result.affectedRows;
}

export async function authenticateUser(username, password) {
	const user = await findByUsername(username);
	if (!user) return null;
	const isMatch = await bcrypt.compare(password, user.password);
	return isMatch ? user : null;
}

export async function isUserTaken(username, email) {
	const users = await findByUsernameOrEmail(username, email);
	return users.length > 0;
}

export async function insertResetToken(user_id) {
	const prevToken = await getPasswordResetToken(user_id);
	if (
		prevToken &&
		Date.now() - new Date(prevToken.created_at) < TOKEN_LIFETIME
	) {
		return { status: "cooldown", token: null };
	}
	const token = crypto.randomBytes(TOKEN_SIZE).toString("hex");
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
	const createdAt = new Date();
	const expiresAt = new Date(Date.now() + TOKEN_LIFETIME);
	await dbConnection
		.promise()
		.query(
			"INSERT INTO reset_tokens (token, created_at, expires_at, user_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token), created_at = VALUES(created_at), expires_at = VALUES(expires_at)",
			[hashedToken, createdAt, expiresAt, user_id],
		);
	return { status: "ok", token };
}

export async function getPasswordResetToken(user_id) {
	const [rows] = await dbConnection
		.promise()
		.query(
			"SELECT token, created_at, expires_at from reset_tokens WHERE user_id = ? AND expires_at > NOW()",
			[user_id],
		);
	return rows[0] || null;
}

export async function deleteResetToken(user_id) {
	await dbConnection
		.promise()
		.query("DELETE FROM reset_tokens WHERE user_id = ?", [user_id]);
}

export async function updatePassword(user_id, password) {
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
	const [result] = await dbConnection
		.promise()
		.query("UPDATE users SET password = ? WHERE id = ?", [
			hashedPassword,
			user_id,
		]);
	return result.affectedRows;
}
