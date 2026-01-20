const { verifyToken } = require('../utils/jwt.utils');

function authMiddleware(req, res, next) {
	const header = req.headers['authorization'] || req.headers['Authorization'];
	if (!header || !String(header).startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Unauthorized: Missing Bearer token' });
	}
	const token = String(header).substring('Bearer '.length);
	try {
		const payload = verifyToken(token);
		req.user = payload;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Unauthorized: Invalid token' });
	}
}

module.exports = authMiddleware;

