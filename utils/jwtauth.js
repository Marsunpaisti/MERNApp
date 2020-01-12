const jwt = require("jsonwebtoken");

module.exports = {
	/** 
	 Encrypts and returns JWT token containing the secureData
	*/
	generateJWTToken: secureData => {
		return jwt.sign(secureData, process.env.JWT_SECRET_KEY, {
			expiresIn: 1000 * 60 * 60 * 3 //3 hours
		});
	},

	/** 
	 Verifies and decrypts the given JWT, returns null on errors, and the decrypted JWT on success
 	*/
	verifyJWTToken: jwtToken => {
		try {
			return jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
		} catch (e) {
			//TODO: smarter error handling, use promises
			console.log(e);
			return null;
		}
	}
};
