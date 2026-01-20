const express = require('express');
const router = express.Router();
const { signToken } = require('../utils/jwt.utils');
const { createUser, verifyCredentials } = require('../services/user.services');

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
		res.status(201).json({
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
		});
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { identifier, password } = req.body || {};
		const user = await verifyCredentials({ identifier, password });
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });
		const token = signToken({
			userId: user._id.toString(),
			username: user.username,
			email: user.email,
		}, { expiresIn: '7d' });
		res.json({ token });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;

