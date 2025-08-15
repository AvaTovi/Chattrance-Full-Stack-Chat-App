import dotenv from "dotenv";
import expressMySQLSession from "express-mysql-session";
import session from "express-session";
import mysql from "mysql2";

dotenv.config();

const MySQLStore = expressMySQLSession(session);

const DB_PORT = process.env.DB_PORT || 3306;

export const dbConnection = mysql.createPool({
	host: process.env.DB_HOST,
	port: DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: process.env.CONNECTION_LIMIT,
});

export const sessionStore = new MySQLStore({
	host: process.env.DB_HOST,
	port: DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	clearExpired: true,
	checkExpirationInterval: 1000 * 60 * 15, // every 15 minutes
	expiration: 1000 * 60 * 60 * 24 * 30, // 30 days
	createDatabaseTable: true,
});
