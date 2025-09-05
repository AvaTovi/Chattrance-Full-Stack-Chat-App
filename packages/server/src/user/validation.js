import validator from "validator";

import {
  ALLOWED_EMAIL_DOMAINS,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  VALID_CHARACTERS,
} from "./constants.js";

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {string} email 
 * @returns {string?}
 */
export function validateSignup(email, username, password) {

  if (typeof username !== "string" || typeof password !== "string" || typeof email !== "string") {
    return "Invalid types";
  }

  if (!username || !password || !email) return "Please fill all fields";

  if (!VALID_CHARACTERS.test(username) || !VALID_CHARACTERS.test(password))
    return "Username and password must be alphanumeric and may include !, @, $, _, and - characters";

  const error = isValidEmail(email);

  if (error) {
    return error;
  }

  if (username.length > MAX_USERNAME_LENGTH)
    return `Username must be <= ${MAX_USERNAME_LENGTH} characters`;

  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH)
    return `Password must be >= ${MIN_PASSWORD_LENGTH} & <= ${MAX_PASSWORD_LENGTH} characters`;

  return null;
}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {boolean} rememberPassword
 * @returns {string?}
 */
export function validateLogin(username, password, rememberPassword) {

  if (typeof username !== "string" || typeof password !== "string" || typeof rememberPassword !== "boolean") {
    return "Invalid types";
  }

  if (!username || !password) return "Please fill all fields";

  if (!VALID_CHARACTERS.test(username) || !VALID_CHARACTERS.test(password))
    return "Username and password must be alphanumeric and may include !, @, $, _, and - characters";

  if (username.length > MAX_USERNAME_LENGTH)
    return `Username must be <= ${MAX_USERNAME_LENGTH} characters`;

  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH)
    return `Password must be >= ${MIN_PASSWORD_LENGTH} & <= ${MAX_PASSWORD_LENGTH} characters`;

  return null;
}

/**
 * 
 * @param {string} email 
 * @returns {string?}
 */
export function isValidEmail(email) {

  if (!validator.isEmail(email)) {
    return "Email does not have valid syntax";
  }

  const domain = email.split("@")[1];

  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return "Email's domain is not whitelisted";
  }

  return null;
}

/**
 * 
 * @param {string} password 
 * @returns {string?}
 */
export function isValidPassword(password) {

  if (typeof password !== "string") {
    return "Invalid type";
  }

  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH)
    return `Password must be >= ${MIN_PASSWORD_LENGTH} & <= ${MAX_PASSWORD_LENGTH} characters`;

  if (!VALID_CHARACTERS.test(password))
    return "Password must be alphanumeric and may include !, @, $, _, and - characters";

  return null;
}

/**
 * 
 * @param {number} id
 * @returns {string?}
 */
export function isValidId(id) {

  if (typeof id !== "number") {
    return "Invalid type";
  }

  if (id < 0) {
    return "Id must be unsigned";
  }

  if (id === Infinity) {
    return "Id must be finite"
  }

  return null;

}

export function isValidToken(token) {

  if (typeof token !== "string") {
    return "Invalid type";
  }

  if (!token) {
    return "Token must not be empty";
  }

  return null;

}