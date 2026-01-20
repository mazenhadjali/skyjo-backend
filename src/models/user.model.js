const mongoose = require('mongoose');
const { Languages } = require('../utils/language.enums');

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		passwordhash: { type: String, required: true },
		firstname: { type: String, trim: true },
		lastname: { type: String, trim: true },
		phone: { type: String, trim: true },
		defaultLanguage: {
			type: String,
			enum: Object.values(Languages),
			default: Languages.EN,
		},
	},
	{ timestamps: true }
);

UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;

