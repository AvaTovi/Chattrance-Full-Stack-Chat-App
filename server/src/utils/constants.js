export const ALLOWED_EMAIL_DOMAINS = [
	"gmail.com",
	"yahoo.com",
	"outlook.com",
	"hotmail.com",
	"live.com",
	"icloud.com",
	"aol.com",
	"protonmail.com",
	"zoho.com",
	"mail.com",
	"gmx.com",
	"yandex.com",
	"fastmail.com",
	"inbox.com",
];
export const LOGIN_DURATION = 1000 * 60 * 60 * 24 * 30;
export const MAX_USERNAME_LENGTH = 50;
export const MAX_PASSWORD_LENGTH = 255;
export const MESSAGE_SIZE = 250;
export const MIN_PASSWORD_LENGTH = 6;
export const SALT_ROUNDS = 10;
export const SESSION_CLEANUP = 1000 * 60 * 15;
export const SESSION_LIFETIME = 1000 * 60 * 60 * 24 * 30;
export const TOKEN_SIZE = 20;
export const TOKEN_LIFETIME = 300000;
export const TOKEN_CLEANUP = 3600000;
export const VALID_CHARACTERS = /^[a-zA-Z0-9!@$_-]+$/;
