const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const jwtAuth = require("../../utils/jwtauth");
const auth = require("../../utils/authmiddleware");

/** 
 List all users
 */
router.get("/", auth.requireMinimumRole("admin"), (req, res) => {
	User.find()
		.sort({ email: 1 })
		.then(items => {
			res.json(items);
		})
		.catch(err => {
			res.json({ ok: false, error: err });
		});
});

//Get currently logged in user
router.get("/me", (req, res) => {
	if (req.session) {
		User.findOne({ _id: req.session.uid })
			.then(user => {
				res.json({
					ok: true,
					email: user.email,
					giveAwayPoints: user.giveAwayPoints,
					giveAwayRolls: user.giveAwayRolls
				});
			})
			.catch(err => {
				res.json({ ok: false, error: err });
			});
	} else {
		res.json({ ok: false, error: { message: "No valid session" } });
	}
});

/** 
 Add a new user with data from req.body. Cannot create admin users
 */
router.post("/register", (req, res) => {
	let newUser = new User({
		email: req.body.email,
		password: req.body.password,
		userType: "user"
	});

	newUser
		.save()
		.then(() => {
			let token = generateAuthorizationToken(newUser);
			res.setHeader("Set-Cookie", `token=${token};max-age=10800;path=/;HttpOnly`);
			res.json({
				email: newUser.email,
				giveAwayPoints: newUser.giveAwayPoints,
				giveAwayRolls: newUser.giveAwayRolls,
				token: token
			});
		})
		.catch(err => {
			res.json({ ok: false, error: err });
		});
});

/** 
 Update user with given ID with data from req.body
 */
router.post("/update/:id", auth.requireMinimumRole("admin"), (req, res) => {
	User.findOne({ _id: req.params.id })
		.then(result => {
			if (result) {
				updated = new User(Object.assign(result, req.body));
				updated
					.save()
					.then(() => {
						res.json(updated);
					})
					.catch(err => {
						res.json({ ok: false, error: err });
					});
			} else {
				res.json(new Error("Could not find an object with id " + req.params.id));
			}
		})
		.catch(err => {
			res.json({ ok: false, error: err });
		});
});

/** 
 Delete a user with given id
 */
router.post("/delete/:id", auth.requireMinimumRole("admin"), (req, res) => {
	User.deleteOne({ _id: req.params.id })
		.then(() => {
			res.json({ ok: true });
		})
		.catch(err => {
			res.json({ ok: false, error: err });
		});
});

/** 
 Handles login POSTS and responds with the JWT cookie on success
 */
router.post("/login", auth.rejectLoggedInUsers, (req, res) => {
	let email = null;
	let password = null;

	if (req.body && req.body.email && req.body.password) {
		email = req.body.email.toLowerCase();
		password = req.body.password;
	}
	if (email && password) {
		User.findOne({ email })
			.then(user => {
				if (!user) {
					return res.status(403).json({
						ok: false,
						error: {
							message: "User with that email does not exist.",
							code: 403
						}
					});
				}
				user.comparePassword(password, (error, isCorrectPassword) => {
					if (isCorrectPassword) {
						let token = generateAuthorizationToken(user);
						//Send cookie and set to max-age to 3 hours
						res.setHeader("Set-Cookie", `token=${token};max-age=10800;path=/;HttpOnly`);
						res.json({
							ok: true,
							token: token,
							user: user.email,
							giveAwayPoints: user.giveAwayPoints,
							giveAwayRolls: user.giveAwayRolls
						});
					} else {
						res.status(403).json({
							ok: false,
							error: {
								message: "Incorrect password",
								code: 403
							}
						});
					}
				});
			})
			.catch(err => {
				res.json({ ok: false, error: err });
			});
	} else {
		return res.status(400).json({
			ok: false,
			error: {
				message: "Missing username or password",
				code: 400
			}
		});
	}
});

/**
 * Logs out user
 */
router.post("/logout", auth.requireSession, (req, res) => {
	res.setHeader("Set-Cookie", `token=deleted;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;HttpOnly`);
	return res.json({ ok: true });
});

/**
 * Generates an authorization JWT from a mongoose user document
 */
const generateAuthorizationToken = user => {
	return jwtAuth.generateJWTToken({
		uid: user._id,
		userType: user.userType
	});
};

module.exports = router;
