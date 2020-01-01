const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const validators = require('validator');
const bcrypt = require('bcrypt-nodejs');
const saltRounds = require('../config//default').saltRounds;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: [
			{
				validator: validators.isEmail,
				msg: 'Please input a valid email address'
			}
		]
	},
	password: {
		type: String,
		required: true,
		validate: [
			{
				validator: pwd => validators.isLength(pwd, { min: 8, max: undefined }),
				msg: 'Password must have at least 8 characters'
			}
		]
	},
	userType: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	}
});

UserSchema.pre('save', function(next) {
	var user = this;
	user.email = user.email.toLowerCase();

	// Only hash if password was modified
	if (!user.isModified('password')) return next();

	// Generate salt
	bcrypt.genSalt(saltRounds, function(err, salt) {
		if (err) return next(err);

		// Use generated salt to hash password
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) return next(err);

			// Overwrite the cleartext password with the hash
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

UserSchema.plugin(uniqueValidator);

module.exports = User = mongoose.model('user', UserSchema);
