const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const jwtAuth = require('../../utils/jwtauth');
const requireJwtAuth = require('../../utils/authmiddleware');

//Get all items
router.get('/', requireJwtAuth, (req, res) => {
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
router.get('/:id', requireJwtAuth, (req, res) => {
	User.findOne({ _id: req.params.id })
		.then(user => {
			res.json(user);
		})
		.catch(err => {
			res.json(err);
		});
});

//Add item
router.post('/add', requireJwtAuth, (req, res) => {
	let newUser = new User({
		email: req.body.email,
		password: req.body.password
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
router.post('update/:id', requireJwtAuth, (req, res) => {
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
router.post('/delete/:id', requireJwtAuth, (req, res) => {
	User.deleteOne({ _id: req.params.id })
		.then(() => {
			res.json({ success: true });
		})
		.catch(err => {
			res.json(err);
		});
});

router.post('/login', (req, res) => {
	let email = req.body.user.toLowerCase();
	let password = req.body.password;
	if (email && password) {
		User.findOne({ email })
			.then(user => {
				let token = generateAuthorizationToken(user);
				res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
				res.json({ success: true });
			})
			.catch(err => {
				res.json(err);
			});
	}
});

const generateLoginToken = user => {
	return jwtAuth.generateJWTToken({
		uid: user._id,
		userType: user.userType
	});
};

module.exports = router;
