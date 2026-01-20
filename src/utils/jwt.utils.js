const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/server.config');

function getSecret() {
    const secret = JWT_SECRET;
    if (!secret || typeof secret !== 'string' || secret.trim().length === 0) {
        throw new Error('JWT_SECRET is not set. Define it in environment variables.');
    }
    return secret;
}

// Generate a signed JWT from a payload
// params:
// - payload: object to embed in the token
// - options: { expiresIn?: string|number, issuer?: string, subject?: string, audience?: string }
function signToken(payload, options = {}) {
    const secret = getSecret();
    const defaultOptions = { algorithm: 'HS256' };
    return jwt.sign(payload, secret, { ...defaultOptions, ...options });
}

// Verify a JWT and return its payload
// throws on invalid/expired token
function verifyToken(token, options = {}) {
    const secret = getSecret();
    // options can include issuer, audience, subject, algorithms, etc.
    return jwt.verify(token, secret, options);
}

// Decode a JWT without verifying signature (use with caution)
// returns payload or null
function decodeToken(token) {
    const decoded = jwt.decode(token, { json: true });
    return decoded || null;
}

module.exports = {
    signToken,
    verifyToken,
    decodeToken,
};

