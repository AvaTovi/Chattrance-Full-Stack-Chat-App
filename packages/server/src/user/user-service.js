import bcrypt from "bcryptjs";
import crypto from "crypto";

import { SALT_ROUNDS, TOKEN_LIFETIME, TOKEN_SIZE } from "./constants.js";

import * as userModel from "./user-model.js";

import * as resetTokenModel from "./reset-token-model.js";

export async function createUser(email, name, password) {

  const userEmail = await userModel.getByEmail(email);

  if (userEmail) {
    return { ok: false, message: "Email already taken" };
  }

  const userName = await userModel.getByName(name);

  if (userName) {
    return { ok: false, message: "Username already taken" };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const success = await userModel.create(email, name, passwordHash);

  if (!success) {
    return { ok: false, message: "Failed to create user" };
  }

  return { ok: true, message: "" };

}

export async function authenticateUser(name, password) {

  const user = await userModel.getByName(name);

  if (!user) {
    return { ok: false, message: "User does not exist" };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { ok: false, message: "Incorrect credentials" };
  }

  return { ok: true, message: "", data: { user } };

}

export async function updatePassword(id, password) {

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const success = userModel.updatePassword(id, passwordHash);

  if (!success) {
    return { ok: false, message: "Failed to update password" };
  }

  return { ok: true, message: "" };

}

export async function createResetToken(userId) {

  const user = await userModel.getById(userId);

  if (!user) {
    return { ok: false, message: "User does not exist" };
  }

  const resetToken = resetTokenModel.get(userId);

  if (resetToken) {
    return { ok: false, message: "Token already created" };
  }

  const plainToken = crypto.randomBytes(TOKEN_SIZE).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(plainToken).digest("binary");
  const created = new Date();
  const expires = new Date(Date.now() + TOKEN_LIFETIME);

  const success = resetTokenModel.create(tokenHash, userId, created, expires);

  if (!success) {
    return { ok: false, message: "Failed to create token" };
  }

  return { ok: true, message: "", data: { id: user.id, plainToken } };

}

export async function verifyResetToken(userId, plainToken) {

  const resetToken = await resetTokenModel.get(userId);

  if (!resetToken) {
    return { ok: false, message: "Token doesn't exist" };
  }

  const currentTime = new Date();

  if (resetToken.expires > currentTime) {
    return { ok: false, message: "Token expired" };
  }

  const tokenHash = crypto.createHash("sha256").update(plainToken).digest("binary");

  if (tokenHash !== resetToken.token) {
    return { ok: true, message: "Invalid token" };
  }

  return { ok: true, message: "" };
}
