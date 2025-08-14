module.exports = {
    MAX_USERNAME_LENGTH: 50,
    MAX_PASSWORD_LENGTH: 255,
    MIN_PASSWORD_LENGTH: 6,
    LOGIN_DURATION: 1000 * 60 * 60 * 24 * 30, // 30 days
    TOKEN_SIZE: 32, // Token size in bytes
    TOKEN_LIFETIME: 300000, // Token lifetime in milliseconds
    SALT_ROUNDS: 10, // Number of salt rounds

    // Alphanumeric plus -_!@$
    VALID_CHARACTERS: /^[a-zA-Z0-9!@$_-]+$/,

    // Allowed email domains
    ALLOWED_EMAIL_DOMAINS: [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'live.com',
        'icloud.com',
        'aol.com',
        'protonmail.com',
        'zoho.com',
        'mail.com',
        'gmx.com',
        'yandex.com',
        'fastmail.com',
        'inbox.com'
    ]
};
