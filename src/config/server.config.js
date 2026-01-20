const SERVER_PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

module.exports = {
	SERVER_PORT,
	JWT_SECRET,
	MONGO_URI,
};