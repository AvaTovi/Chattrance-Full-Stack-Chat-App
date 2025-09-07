import dotenv from "dotenv";
import expressMySQLSession from "express-mysql-session";
import session from "express-session";
import mysql from "mysql2";

import { SESSION_CLEANUP, SESSION_LIFETIME } from "../user/constants.js";

dotenv.config();

const MySQLStore = expressMySQLSession(session);

export const dbConnection = mysql.createPool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	connectionLimit: process.env.DB_CONNECTION_LIMIT
});

export const sessionStore = new MySQLStore({
	clearExpired: true,
	checkExpirationInterval: SESSION_CLEANUP,
	createDatabaseTable: true,
	maxAge: SESSION_LIFETIME
}, dbConnection.promise());
