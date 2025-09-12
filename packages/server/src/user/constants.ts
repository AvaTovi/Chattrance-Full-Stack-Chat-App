const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Max number of valid active tokens
 */
export const ACTIVE_TOKENS = 3;

/**
 * Whitelist of allowed email domains for user registration.
 */
export const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "protonmail.com"
];

export const MAX_USERNAME_LENGTH = 64;

export const MAX_PASSWORD_LENGTH = 64;

export const MIN_PASSWORD_LENGTH = 6;

/**
 * Number of salt rounds used in hashing.
 */
export const SALT_ROUNDS = 10;

/**
 * Interval for removing expired user sessions in milliseconds.
 */
export const SESSION_CLEANUP = 15 * MINUTE;

/**
 * Default user's session lifetime in milliseconds.
 */
export const SESSION_LIFETIME = 7 * DAY;

/**
 * Extended user's session lifetime in milliseconds.
 */
export const SESSION_LIFETIME_EXTENDED = 30 * DAY;

/**
 * Token's entropy in bytes.
 */
export const TOKEN_SIZE = 20;

/**
 * Reset token's lifetime in milliseconds.
 */
export const TOKEN_LIFETIME = 15 * MINUTE;

/**
 * Validates that a string is non-empty and contains only alphanumeric characters, exclamations (!), commerical at (@),
 * number sign (#), dollar sign ($), underscores(_), or hyphens (-). String's max length is 64. Must have at least 1 letter and 1 number.
 * 
 * @param {string} password - The string to validate.
 * @returns {boolean} True if the string is valid, false otherwise.
 * 
 */
export const VALID_PASSWORD_CHARACTERS = /^(?=.*[0-9])(?=.*[A-Za-z])[a-zA-Z0-9!@#$_-]{6,64}$/;

/**
 * Validates that a string is non-empty and contains only alphanumeric characters,
 * underscores (_), or hyphens (-). String's max length is 64.
 *
 * @param {string} username - The string to validate.
 * @returns {boolean} True if the string is valid, false otherwise.
 */
export const VALID_USERNAME_CHARACTERS = /^[a-zA-Z0-9_-]{1,64}$/;

