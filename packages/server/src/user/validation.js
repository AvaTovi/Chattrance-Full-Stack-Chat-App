import validator from "validator";

import {
  ALLOWED_EMAIL_DOMAINS,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  VALID_PASSWORD_CHARACTERS,
  VALID_USERNAME_CHARACTERS
} from "./constants.js";

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 * @returns {string?}
 */
export function validateSignup(email, username, password) {

  const emailError = isValidEmail(email)

  if (emailError) {
    return emailError;
  }

  const usernameError = isValidUsername(username);

  if (usernameError) {
    return usernameError;
  }

  const passwordError = isValidPassword(password);

  if (passwordError) {
    return passwordError;
  }

  return null;
}

/**
 * 
 * @param {string} username 
 * @param {string} password
 * @returns {string?}
 */
export function validateLogin(username, password) {

  const usernameError = isValidUsername(username);

  if (usernameError) {
    return usernameError;
  }

  const passwordError = isValidPassword(password);

  if (passwordError) {
    return passwordError;
  }

  return null;
}

/**
 * 
 * @param {string} email 
 * @returns {string?}
 */
export function isValidEmail(email) {

  if (!validator.isEmail(email)) {
    return "Email does not have valid syntax.";
  }

  const domain = email.split("@")[1];

  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return "Email's domain is not whitelisted.";
  }

  return null;
}

/**
 * 
 * @param {string} username 
 * @returns {string?}
 */
export function isValidUsername(username) {

  if (!VALID_USERNAME_CHARACTERS.test(username)) {
    return `Username must be 1–${MAX_USERNAME_LENGTH} characters. Must contain only alphanumeric characters and: "_", "-".`
  }

  return null;

}

/**
 * 
 * @param {string} password 
 * @returns {string?}
 */
export function isValidPassword(password) {

  if (!VALID_PASSWORD_CHARACTERS.test(password)) {
    return `Password must be ${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters. Must contain only alphanumeric characters and: "!", "@", "#", "$", "_", "-".`;
  }

  return null;
}

/**
 * 
 * @param {number} number 
 */
export function isValidId(number) {

  if (!Number.isFinite(userId) || !Number.isInteger(number)) {

  }

}