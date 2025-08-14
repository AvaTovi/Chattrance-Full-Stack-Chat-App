const db = require('../db');
const bcrypt = require('bcryptjs');
const { TOKEN_SIZE, TOKEN_LIFETIME, SALT_ROUNDS } = require('../utils/constants')
require('dotenv').config();

async function findByUsername(username) {
    const [rows] = await db.promise().query(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    return rows[0] || null;
}

async function findByUsernameOrEmail(username, email) {
    const [rows] = await db.promise().query(
        'SELECT id, username, email FROM users WHERE username = ? OR email = ?',
        [username, email]
    );
    return rows;
}

async function findByEmail(email) {
    const [rows] = await db.promise().query(
        'SELECT email FROM users WHERE email = ?',
        [email]
    );
    return rows[0] || null;
}

async function createUser(username, password, email) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.promise().query(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        [username, hashedPassword, email]
    );
    return result.insertId;
}

async function authenticateUser(username, password) {
    const user = await findByUsername(username);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
}

async function isUserTaken(username, email) {
    const users = await findByUsernameOrEmail(username, email);
    return users.length > 0;
}

async function insertResetToken(user_id) {
    const token = crypto.randomBytes(TOKEN_SIZE).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + TOKEN_LIFETIME);
    const [result] = await db.promise().query(
        'INSERT INTO reset_tokens (token, created_at, expires_at, user_id) VALUES (?, ?, ?, ?)',
        [hashedToken, createdAt, expiresAt, user_id]
    );
    return result.affectedRows === 1 ? token : null;
}

async function getPasswordResetToken(user_id) {
    const [rows] = await db.promise().query(
        'SELECT token, expires_at from reset_tokens WHERE user_id = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
        [user_id]
    );
    return rows[0] || null;
}

async function deleteResetToken(user_id) {
    const [result] = await db.promise().query(
        'DELETE FROM reset_tokens WHERE user_id = ?',
        [user_id]
    );
    return result.affectedRows === 1;
}

async function updatePassword(user_id, password) {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.promise().query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, user_id]
    );
    return result.affectedRows === 1;
}

module.exports = {
    findByUsername,
    findByUsernameOrEmail,
    findByEmail,
    createUser,
    authenticateUser,
    isUserTaken,
    insertResetToken,
    getPasswordResetToken,
    deleteResetToken,
    updatePassword
}