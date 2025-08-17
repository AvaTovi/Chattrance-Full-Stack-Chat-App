CREATE DATABASE IF NOT EXISTS chat_app;

USE chat_app;

CREATE TABLE IF NOT EXISTS users (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reset_tokens (
    user_id INT UNSIGNED PRIMARY KEY,
    token CHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversations (
    conv_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_one INT UNSIGNED,
    user_two INT UNSIGNED,
    FOREIGN KEY (user_one) REFERENCES users (user_id) ON DELETE SET NULL,
    FOREIGN KEY (user_two) REFERENCES users (user_id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY pair (
        LEAST(user_one, user_two),
        GREATEST(user_one, user_two)
    )
);

CREATE TABLE IF NOT EXISTS messages (
    msg_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    send_id INT UNSIGNED,
    recv_id INT UNSIGNED,
    content VARCHAR(250) NOT NULL,
    FOREIGN KEY (send_id) REFERENCES users (user_id) ON DELETE SET NULL,
    FOREIGN KEY (recv_id) REFERENCES users (user_id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE EVENT IF NOT EXISTS cleanup_reset_tokens
    ON SCHEDULE EVERY 30 MINUTE
    COMMENT 'Delete expired reset tokens'
    DO
        DELETE FROM reset_tokens WHERE expires_at < CURRENT_TIMESTAMP;

CREATE EVENT IF NOT EXISTS cleanup_conversations
    ON SCHEDULE EVERY 30 MINUTE
    COMMENT "Delete conversations if both users delete their accounts"
    DO
        DELETE FROM conversations WHERE user_one IS NULL AND user_two IS NULL;