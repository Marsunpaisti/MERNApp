const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const validators = require("validator");
const bcrypt = require("bcryptjs");
const saltRounds = require("../config//default").saltRounds;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: [
			{
				validator: validators.isEmail,
				msg: "Please input a valid email address"
			}
		]
	},
	password: {
		type: String,
		required: true,
		validate: [
			{
				validator: pwd => validators.isLength(pwd, { min: 8, max: undefined }),
				msg: "Password must have at least 8 characters"
			}
		]
	},
	userType: {
		type: String,
		enum: ["user", "admin"],
		default: "user"
	},
	giveAwayRolls: {
		type: Number,
		default: 20
	},
	giveAwayPoints: {
		type: Number,
		default: 0
	}
});

/** 
 Hashes user password and lowercases the emails before saving
 */
UserSchema.pre("save", function(next) {
	var user = this;
	user.email = user.email.toLowerCase();

	// Only hash if password was modified
	if (!user.isModified("password")) return next();

	// Generate salt
	bcrypt.genSalt(saltRounds, function(err, salt) {
		if (err) return next(err);

		// Use generated salt to hash password
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// Overwrite the cleartext password with the hash
			user.password = hash;
			next();
		});
	});
});

/** 
 Hashes and compares the given password to the users password in the database
 */
UserSchema.methods.comparePassword = async function(candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.plugin(uniqueValidator);

module.exports = User = mongoose.model("user", UserSchema);
