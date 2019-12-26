const jwtAuth = require('./jwtauth');

const requireAuthentication = (req, res, next) => {
	let authHeader = req.header('Authorization');

	//Require authorization header to exist
	if (!authHeader) {
		return res.status(401).json({
			ok: false,
			error: {
				reason: 'Missing authorization header',
				code: 401
			}
		});
	}

	let token = authHeader.split(' ')[1];

	//Require a token to exist
	if (!token) {
		return res.status(401).json({
			ok: false,
			error: {
				reason: 'Missing session token',
				code: 401
			}
		});
	}

	//Require token to be valid
	let secretData = jwtAuth.verifyJWTToken(token);
	if (!secretData) {
		return res.status(401).json({
			ok: false,
			error: {
				reason: 'Invalid session token',
				code: 401
			}
		});
	}

	req.session = secretData;
	console.log('Decoded JWT token into data');
	console.log(secretData);
	next();
};

module.exports = requireAuthentication;
