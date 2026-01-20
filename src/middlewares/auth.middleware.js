const { verifyToken } = require('../utils/jwt.utils');
const { sendError } = require('../utils/response.utils');

function authMiddleware(req, res, next) {
	const header = req.headers['authorization'] || req.headers['Authorization'];
	if (!header || !String(header).startsWith('Bearer ')) {
		return sendError(res, 'Unauthorized: Missing Bearer token', 401);
	}
	const token = String(header).substring('Bearer '.length);
	try {
		const payload = verifyToken(token);
		req.user = payload;
		next();
	} catch (err) {
		return sendError(res, 'Unauthorized: Invalid token', 401);
	}
}

module.exports = authMiddleware;

