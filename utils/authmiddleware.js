const jwtAuth = require("./jwtauth");

module.exports = {
	requireSession: requireSession,
	requireMinimumRole: requireMinimumRole,
	redirectLoggedInUsers: redirectLoggedInUsers,
	rejectLoggedInUsers: rejectLoggedInUsers,
	tokenParser: tokenParser
};

/** 
 Parses request JWT tokens into req.session if valid
 */
function tokenParser(req, res, next) {
	let token = null;
	if (req.cookies && req.cookies.token) {
		token = req.cookies.token;
	}

	//Require authorization header to exist
	if (!token) {
		return next();
	}

	//Require token to be valid
	let secureData = jwtAuth.verifyJWTToken(token);
	if (secureData) {
		req.session = secureData;
	}

	return next();
}

/** 
 Rejects users that are logged in from accessing the route
 */
function rejectLoggedInUsers(req, res, next) {
	let token = null;
	if (req.cookies) {
		token = req.cookies.token;
	}

	if (!token) {
		return next();
	}

	let secureData = jwtAuth.verifyJWTToken(token);
	if (secureData) {
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

/** 
 Redirects authenticated users to given url
 */
function redirectLoggedInUsers(url) {
	return (
		redirectLoggedInUsers[url] ||
		(redirectLoggedInUsers[url] = function(req, res, next) {
			let token = null;
			if (req.cookies) {
				token = req.cookies.token;
			}

			let secureData = jwtAuth.verifyJWTToken(token);
			if (secureData) {
				res.redirect(url);
			}
			return next();
		})
	);
}

/** 
 Requires that user has a valid JWT authorization token and stores it into req.session
 */
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
	let secureData = jwtAuth.verifyJWTToken(token);
	if (!secureData) {
		return res.status(401).json({
			ok: false,
			error: {
				message: "Invalid session token",
				code: 401
			}
		});
	}

	req.session = secureData;
	return next();
}

const roles = Object.freeze({
	user: 0,
	admin: 1
});

/** 
 Checks that user at least the authorization of a given role
 */
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
