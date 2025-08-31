const db = require('../config/db');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin,
                token: generateToken(user.user_id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const result = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, name, email, is_admin',
            [name, email, password_hash]
        );
        const newUser = result.rows[0];

        if (newUser) {
            res.status(201).json({
                user_id: newUser.user_id,
                name: newUser.name,
                email: newUser.email,
                is_admin: newUser.is_admin,
                token: generateToken(newUser.user_id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUserProfile = async (req, res) => {
    const { rows } = await db.query('SELECT user_id, name, email, is_admin FROM users WHERE user_id = $1', [req.user.user_id]);
    const user = rows[0];
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { authUser, registerUser, getUserProfile };