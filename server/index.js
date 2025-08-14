const express = require('express');
const session = require('express-session');
const { sessionStore } = require('./db');
const path = require('path');
const http = require('http');
const setupSocket = require('./socket');
require('dotenv').config();

const app = express();

const APP_PORT = process.env.APP_PORT || 3000;

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    }
}));

const authRouter = require('./routes/auth');
app.use('/', authRouter);

app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const server = http.createServer(app);
const io = setupSocket(server);

app.listen(APP_PORT, () => console.log(`Server running on http://localhost:${APP_PORT}`));