const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const MAX_USERNAME_LENGTH = 50;
const MAX_PASSWORD_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 6;
const VALID_CHARACTERS = /^[a-zA-Z0-9_-]+$/;
const CHECK_QUERY = 'SELECT * FROM users WHERE username = ? OR email = ?';
const INSERT_QUERY = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'chat_app'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.route('/signup').post(async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'All fields must be nonempty' });
    }

    if (!VALID_CHARACTERS.test(username) || !VALID_CHARACTERS.test(password)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username and password must be alphanumeric, underscore, or dash only' })
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
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Signup failed' });
    }
})
    .all((req, res) => {
        res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ message: 'Method not allowed' });
    });

app.listen(3000, () => console.log('Server running on http://localhost:3000'));