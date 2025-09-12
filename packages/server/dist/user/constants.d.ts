/**
 * Max number of valid active tokens
 */
export declare const ACTIVE_TOKENS = 3;
/**
 * Whitelist of allowed email domains for user registration.
 */
export declare const ALLOWED_EMAIL_DOMAINS: string[];
export declare const MAX_USERNAME_LENGTH = 64;
export declare const MAX_PASSWORD_LENGTH = 64;
export declare const MIN_PASSWORD_LENGTH = 6;
/**
 * Number of salt rounds used in hashing.
 */
export declare const SALT_ROUNDS = 10;
/**
 * Interval for removing expired user sessions in milliseconds.
 */
export declare const SESSION_CLEANUP: number;
/**
 * Default user's session lifetime in milliseconds.
 */
export declare const SESSION_LIFETIME: number;
/**
 * Extended user's session lifetime in milliseconds.
 */
export declare const SESSION_LIFETIME_EXTENDED: number;
/**
 * Token's entropy in bytes.
 */
export declare const TOKEN_SIZE = 20;
/**
 * Reset token's lifetime in milliseconds.
 */
export declare const TOKEN_LIFETIME: number;
/**
 * Validates that a string is non-empty and contains only alphanumeric characters, exclamations (!), commerical at (@),
 * number sign (#), dollar sign ($), underscores(_), or hyphens (-). String's max length is 64. Must have at least 1 letter and 1 number.
 *
 * @param {string} password - The string to validate.
 * @returns {boolean} True if the string is valid, false otherwise.
 *
 */
export declare const VALID_PASSWORD_CHARACTERS: RegExp;
/**
 * Validates that a string is non-empty and contains only alphanumeric characters,
 * underscores (_), or hyphens (-). String's max length is 64.
 *
 * @param {string} username - The string to validate.
 * @returns {boolean} True if the string is valid, false otherwise.
 */
export declare const VALID_USERNAME_CHARACTERS: RegExp;
//# sourceMappingURL=constants.d.ts.map