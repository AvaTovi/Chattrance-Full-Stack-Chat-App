import bcrypt from "bcryptjs";
import crypto from "crypto";

import { ACTIVE_TOKENS, SALT_ROUNDS, TOKEN_LIFETIME, TOKEN_SIZE } from "./constants.js";

import * as userModel from "./user-model.js";
import * as resetTokenModel from "./reset-token-model.js";

import { ERROR_CODES } from "./error-codes.js";

/**
 * 
 * @param {string} email 
 * @param {string} name 
 * @param {string} password
 * @returns { Promise<{ ok : boolean, message: string | undefined }> }
 */
export async function createUser(email, name, password) {

  const userByEmail = await userModel.getByEmail(email);

  if (userByEmail) {
    return { ok: false, message: ERROR_CODES.EMAIL_TAKEN };
  }

  const userByName = await userModel.getByName(name);

  if (userByName) {
    return { ok: false, message: ERROR_CODES.USERNAME_TAKEN };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const success = await userModel.create(email, name, passwordHash);

  if (!success) {
    return { ok: false, message: ERROR_CODES.CREATE_USER_FAILED };
  }

  return { ok: true };

}

/**
 * 
 * @param {string} name 
 * @param {string} password 
 * @returns { Promise<{ ok: boolean, message: string | undefined, data: { user: { id: number, email: string, name: string, created: Date } } | undefined }> }
 */
export async function authenticateUser(name, password) {

  const userData = await userModel.getByName(name);

  if (!userData) {
    return { ok: false, message: ERROR_CODES.USER_NOT_FOUND };
  }

  const { password: passwordHash, ...user } = userData;

  if (!await bcrypt.compare(password, passwordHash)) {
    return { ok: false, message: ERROR_CODES.INCORRECT_PASSWORD };
  }

  return { ok: true, data: { user } };

}

/**
 * 
 * @param {number} id
 * @param {string} password
 * @returns { Promise<{ ok: boolean, message: string | undefined }> }
 */
export async function updatePassword(id, password) {

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const success = await userModel.updatePassword(id, passwordHash);

  return success ?
    { ok: true } :
    { ok: false, message: ERROR_CODES.UPDATE_PASSWORD_FAILED };
}

/**
 * 
 * @param {number} userId 
 * @returns { Promise<{ ok: boolean, message: string | undefined, data: { plainToken: string } | undefined }> }
 */
export async function createResetToken(userId) {

  const user = await userModel.getById(userId);

  if (!user) {
    return { ok: false, message: ERROR_CODES.USER_NOT_FOUND };
  }

  const resetTokens = await resetTokenModel.get(userId);

  if (resetTokens) {
    const currentTime = new Date();

    const validTokens = resetTokens.filter(entry => currentTime < entry.expires);

    if (validTokens.length >= ACTIVE_TOKENS) {
      return { ok: false, message: ERROR_CODES.TOKENS_ALREADY_EXIST }
    }
  }

  const plainToken = crypto.randomBytes(TOKEN_SIZE).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(plainToken).digest();

  const created = new Date();
  const expires = new Date(Date.now() + TOKEN_LIFETIME);

  const success = await resetTokenModel.create(tokenHash, userId, created, expires);

  if (!success) {
    return { ok: false, message: ERROR_CODES.TOKEN_CREATION_FAILED };
  }

  return { ok: true, data: { plainToken } };

}

/**
 * 
 * @param {number} userId 
 * @param {string} plainToken 
 * @returns { Promise<{ ok: boolean, message: string | undefined} }
 */
export async function verifyResetToken(userId, plainToken) {

  const resetTokens = await resetTokenModel.get(userId);

  if (!resetTokens) {
    return { ok: false, message: ERROR_CODES.NO_TOKENS_FOUND };
  }

  const currentTime = new Date();

  const validTokens = resetTokens.filter(entry => currentTime < entry.expires);

  if (validTokens.length === 0) {
    return { ok: false, message: ERROR_CODES.NO_TOKENS_FOUND };
  }

  const tokenHash = crypto.createHash("sha256").update(plainToken).digest();

  const oneMatch = validTokens.find(entry => Buffer.compare(entry.token, tokenHash) === 0);

  if (!oneMatch) {
    return { ok: false, message: ERROR_CODES.INVALID_TOKEN };
  }

  if (!await resetTokenModel.deleteToken(userId)) {
    return { ok: false, message: ERROR_CODES.DELETE_TOKEN_FAILED };
  }

  return { ok: true };
}
