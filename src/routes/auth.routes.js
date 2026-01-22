const express = require('express');
const router = express.Router();
const { signToken } = require('../utils/jwt.utils');
const { createUser, verifyCredentials } = require('../services/user.services');
const { sendSuccess, sendError } = require('../utils/response.utils');
const { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = require('../config/server.config');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstname, lastname, phone, defaultLanguage } = req.body || {};
        const user = await createUser({ username, email, password, firstname, lastname, phone, defaultLanguage });

        const accessToken = signToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        }, { expiresIn: ACCESS_TOKEN_EXPIRY });

        const refreshToken = signToken({
            userId: user._id.toString(),
        }, { expiresIn: REFRESH_TOKEN_EXPIRY });

        return sendSuccess(res, {
            accessToken,
            refreshToken,
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

        const accessToken = signToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        }, { expiresIn: ACCESS_TOKEN_EXPIRY });

        const refreshToken = signToken({
            userId: user._id.toString(),
        }, { expiresIn: REFRESH_TOKEN_EXPIRY });

        return sendSuccess(res, { accessToken, refreshToken }, 'Login successful');
    } catch (err) {
        return sendError(res, err.message, 400);
    }
});

router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body || {};
        if (!refreshToken) return sendError(res, 'Refresh token is required', 400);
        const decoded = require('../utils/jwt.utils').verifyToken(refreshToken);
        const userId = decoded.userId;
        const user = await require('../services/user.services').getUserById(userId);
        if (!user) return sendError(res, 'User not found', 404);
        const newAccessToken = signToken({
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
        }, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const newRefreshToken = signToken({
            userId: user._id.toString(),
        }, { expiresIn: REFRESH_TOKEN_EXPIRY });
        return sendSuccess(res, { accessToken: newAccessToken, refreshToken: newRefreshToken }, 'Access token refreshed');
    } catch (err) {
        return sendError(res, err.message, 400);
    }
});

module.exports = router;

