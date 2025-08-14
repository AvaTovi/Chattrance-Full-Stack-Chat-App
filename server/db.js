const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const DB_PORT = process.env.DB_PORT || 3306;

const dbConnection = mysql.createPool({
    host: process.env.DB_HOST,
    port: DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: process.env.CONNECTION_LIMIT
});

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    clearExpired: true,
    checkExpirationInterval: 1000 * 60 * 15, // every 15 minutes
    expiration: 1000 * 60 * 60 * 24 * 30, // 30 days
    createDatabaseTable: true
});

module.exports = { dbConnection, sessionStore };