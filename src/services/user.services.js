const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { isValidLanguage } = require('../utils/language.enums');

async function createUser({ username, email, password, firstname, lastname, phone, defaultLanguage }) {
	if (!username || !email || !password) {
		throw new Error('username, email, and password are required');
	}
	const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
	if (existing) {
		throw new Error('User with given email or username already exists');
	}
	const salt = await bcrypt.genSalt(10);
	const passwordhash = await bcrypt.hash(password, salt);
	const lang = isValidLanguage(defaultLanguage) ? String(defaultLanguage).toLowerCase() : undefined;

	const user = await User.create({
		username: username.toLowerCase(),
		email: email.toLowerCase(),
		passwordhash,
		firstname,
		lastname,
		phone,
		...(lang ? { defaultLanguage: lang } : {}),
	});
	return user;
}

async function verifyCredentials({ identifier, password }) {
	// identifier can be email or username
	if (!identifier || !password) throw new Error('identifier and password are required');
	const query = identifier.includes('@')
		? { email: identifier.toLowerCase() }
		: { username: identifier.toLowerCase() };
	const user = await User.findOne(query);
	if (!user) return null;
	const ok = await bcrypt.compare(password, user.passwordhash);
	if (!ok) return null;
	return user;
}

async function getUserById(id) {
	return User.findById(id);
}

module.exports = {
	createUser,
	verifyCredentials,
	getUserById,
};

