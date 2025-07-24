const express = require('express');
const mysql = require('mysql2');
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const MAX_USERNAME_LENGTH = 50;
const MAX_PASSWORD_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 6;
const PORT = process.env.PORT || 3001;
const THREE_DAYS = 1000 * 60 * 60 * 24 * 3;

// Alphanumeric plus underscores and dashes
const VALID_CHARACTERS = /^[a-zA-Z0-9_-]+$/;

const CHECK_QUERY = 'SELECT * FROM users WHERE username = ? OR email = ?';
const INSERT_QUERY = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
const USER_QUERY = 'SELECT * FROM users WHERE username = ?';

const app = express();
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.get('/me', (req, res) => {
    if (req.session.user) {
        return res.status(StatusCodes.OK).json({ user: req.session.user });
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not logged in' });
    }
});

app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields must be nonempty' });
    }

    if (!VALID_CHARACTERS.test(username) || !VALID_CHARACTERS.test(password)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username and password must be alphanumeric, underscore, or dash only' });
    }

    if (!validator.isEmail(email, {
        allow_display_name: false,
        require_tld: true,
        blacklisted_chars: '',
        host_whitelist: ['gmail.com', 'yahoo.com', 'outlook.com']
    })) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid email format' });
    }

    if (username.length > MAX_USERNAME_LENGTH) return res.status(StatusCodes.BAD_REQUEST).json({ message: `Username must be <= ${MAX_USERNAME_LENGTH} characters` });
    if (password.length > MAX_PASSWORD_LENGTH) return res.status(StatusCodes.BAD_REQUEST).json({ message: `Password must be <= ${MAX_PASSWORD_LENGTH} characters` });
    if (password.length < MIN_PASSWORD_LENGTH) return res.status(StatusCodes.BAD_REQUEST).json({ message: `Password must be >= ${MIN_PASSWORD_LENGTH} characters` });

    try {
        const [rows] = await db.promise().query(CHECK_QUERY, [username, email]);
        if (rows.length) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username or email already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query(INSERT_QUERY, [username, hashedPassword, email]);
        res.status(StatusCodes.CREATED).json({ message: 'Signup successful' });
    } catch (err) {
        console.error(err);
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Signup failed' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password, remember } = req.body;

    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields must be nonempty' });
    }

    try {
        const [rows] = await db.promise().query(USER_QUERY, [username]);
        if (!rows.length) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid login' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid login' });
        }

        if (remember) {
            req.session.cookie.maxAge = THREE_DAYS;
        } else {
            req.session.cookie.expires = false;
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        return res.status(StatusCodes.OK).json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        return res.status(StatusCodes.OK).json({ message: 'Logout successful' });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));