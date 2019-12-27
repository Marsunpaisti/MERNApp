const jwtAuth = require('./jwtauth');

module.exports = {
	requireAuthentication: (req, res, next) => {
	let token = req.cookies.token;

	//Require authorization header to exist
	if (!token) {
		return res.status(401).json({
			ok: false,
			error: {
				reason: 'Missing authorization cookie',
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
	next();
},  ensureAdminRole = (req, res, next) => {
	let token = req.cookies.token;

	//Require authorization header to exist
	if (!token) {
		return res.status(401).json({
			ok: false,
			error: {
				reason: 'Missing authorization cookie',
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

	if (!req.session.userType === "admin"){
		return res.status(401).json({
			ok: false,
			error: {
				reason: 'Insufficient user access rights',
				code: 401
			}
		});
	}

	next();
	}
}
