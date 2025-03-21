const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unqiue: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
	},
	{ timestamps: true }
);
const User = mongoose.model('User', userSchema) || mongoose.models.User;
module.exports = User;
