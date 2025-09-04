import crypto from "crypto";

import { dbConnection } from "../config/db.js";
import { TOKEN_LIFETIME, TOKEN_SIZE } from "../utils/constants.js";

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
 * @returns { Promise<string?> }
 */
export async function insertResetToken(user_id) {
  const prevToken = await getPasswordResetToken(user_id);

  if (prevToken && Date.now() - new Date(prevToken.created).getTime() < TOKEN_LIFETIME) {
    return null;
  }

  const plainToken = crypto.randomBytes(TOKEN_SIZE).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");

  const created = new Date();
  const expires = new Date(Date.now() + TOKEN_LIFETIME);

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
      [hashedToken, user_id, created, expires],
    );

  return plainToken;
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
  const checkToken = crypto.createHash("sha256").update(plain_token).digest("binary");
  return checkToken === record.token;
}
