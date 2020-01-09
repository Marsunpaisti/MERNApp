const jwtAuth = require("./jwtauth");

module.exports = {
	requireAuthentication: requireSession,
	requireMinimumRole: requireMinimumRole,
	redirectLoggedInUsers: redirectLoggedInUsers,
	rejectLoggedInUsers: rejectLoggedInUsers
};

function rejectLoggedInUsers(req, res, next) {
	let token = null;
	if (req.cookies) {
		token = req.cookies.token;
	}

	if (!token){
		return next();
	}

	let secretData = jwtAuth.verifyJWTToken(token);
	if (secretData) {
		return res.status(401).json({
			ok: false,
			error: {
				message: "Already logged in",
				code: 400
			}
		});
	}

	return next();
}

function redirectLoggedInUsers(url) {
	return (
		redirectLoggedInUsers[url] ||
		(redirectLoggedInUsers[url] = function(req, res, next) {
			let token = null;
			if (req.cookies) {
				token = req.cookies.token;
			}

			let secretData = jwtAuth.verifyJWTToken(token);
			if (secretData) {
				res.redirect(url);
			}
			return next();
		})
	);
}

function requireSession(req, res, next) {
	let token = null;
	if (req.cookies) {
		token = req.cookies.token;
	}

	//Require authorization header to exist
	if (!token) {
		return res.status(401).json({
			ok: false,
			error: {
				message: "Missing token cookie",
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
				message: "Invalid session token",
				code: 401
			}
		});
	}

	req.session = secretData;
	next();
}

const roles = Object.freeze({
	user: 0,
	admin: 1
});

function requireMinimumRole(role) {
	role = role.toLowerCase();
	return (
		requireMinimumRole[role] ||
		(requireMinimumRole[role] = function(req, res, next) {
			requireSession(req, res, function() {
				if (!req.session || roles[req.session.userType] < roles[role]) {
					return res.status(403).json({
						ok: false,
						error: {
							message: "Access denied",
							code: 403
						}
					});
				}
				return next();
			});
		})
	);
}
