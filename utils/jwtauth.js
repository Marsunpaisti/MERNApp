const jwt = require('jsonwebtoken');

module.exports = {
	generateJWTToken: secureData => {
		return jwt.sign(secureData, process.env.JWT_SECRET_KEY, {
			expiresIn: 1000 * 60 * 60 * 3 //3 hours
		});
	},

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
