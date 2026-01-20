const express = require('express');
const router = express.Router();
const { signToken } = require('../utils/jwt.utils');
const { createUser, verifyCredentials } = require('../services/user.services');
const { sendSuccess, sendError } = require('../utils/response.utils');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstname, lastname, phone, defaultLanguage } = req.body || {};
        const user = await createUser({ username, email, password, firstname, lastname, phone, defaultLanguage });
        const token = signToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        }, { expiresIn: '7d' });
        return sendSuccess(res, {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                phone: user.phone,
                defaultLanguage: user.defaultLanguage,
            },
        }, 'Registered successfully', 201);
    } catch (err) {
        return sendError(res, err.message, 400);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body || {};
        const user = await verifyCredentials({ identifier, password });
        if (!user) return sendError(res, 'Invalid credentials', 401);
        const token = signToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        }, { expiresIn: '7d' });
        return sendSuccess(res, { token }, 'Login successful');
    } catch (err) {
        return sendError(res, err.message, 400);
    }
});

module.exports = router;

