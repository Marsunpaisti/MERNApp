const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const jwtAuth = require('../../utils/jwtauth');
const requireAuth = require('../../utils/authmiddleware').requireAuthentication;
const ensureAdminRole = require('../../utils/authmiddleware').ensureAdminRole;
const redirectLoggedInUsers = require('../../utils/authmiddleware')
	.redirectLoggedInUsers;

//Get all items
router.get('/', requireAuth, (req, res) => {
	User.find()
		.sort({ email: 1 })
		.then(items => {
			res.json(items);
		})
		.catch(err => {
			res.json(err);
		});
});

//Get a single item
router.get('/:id', requireAuth, (req, res) => {
	User.findOne({ _id: req.params.id })
		.then(user => {
			res.json(user);
		})
		.catch(err => {
			res.json(err);
		});
});

//Add item
router.post('/add', ensureAdminRole, (req, res) => {
	let newUser = new User({
		email: req.body.email,
		password: req.body.password,
		userType: 'user'
	});

	newUser
		.save()
		.then(() => {
			res.json(newUser);
		})
		.catch(err => {
			res.json(err);
		});
});

//Update item
router.post('/update/:id', ensureAdminRole, (req, res) => {
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
						res.json(err);
					});
			} else {
				res.json(
					new Error('Couldn not find an object with id ' + req.params.id)
				);
			}
		})
		.catch(err => {
			res.json(err);
		});
});

//Delete item
router.post('/delete/:id', ensureAdminRole, (req, res) => {
	User.deleteOne({ _id: req.params.id })
		.then(() => {
			res.json({ ok: true });
		})
		.catch(err => {
			res.json(err);
		});
});

router.post('/login', redirectLoggedInUsers, (req, res) => {
	let email = null;
	let password = null;
	if (req.body && req.body.user && req.body.password) {
		email = req.body.user.toLowerCase();
		password = req.body.password;
	}
	if (email && password) {
		User.findOne({ email })
			.then(user => {
				if (!user) {
					res.status(403).json({
						ok: false,
						error: {
							reason: 'User with that email does not exist.',
							code: 403
						}
					});
				}
				user.comparePassword(password, (error, isCorrectPassword) => {
					if (isCorrectPassword) {
						let token = generateAuthorizationToken(user);
						res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
						res.json({ ok: true });
						console.log('Issued user with auth token');
						console.log(jwtAuth.verifyJWTToken(token));
					} else {
						res.status(403).json({
							ok: false,
							error: {
								reason: 'Incorrect password',
								code: 403
							}
						});
					}
				});
			})
			.catch(err => {
				res.json(err);
			});
	} else {
		res.status(400).json({
			ok: false,
			error: {
				reason: 'Missing username or password',
				code: 400
			}
		});
	}
});

const generateAuthorizationToken = user => {
	return jwtAuth.generateJWTToken({
		uid: user._id,
		userType: user.userType
	});
};

module.exports = router;
