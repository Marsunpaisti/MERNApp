const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const jwtAuth = require("../../utils/jwtauth");
const auth = require("../../utils/authmiddleware");

/** 
 Sends the CSRF token to client to be included in headers for future requests
 */
router.get("/token", (req, res) => {
	let token = req.csrfToken();
	res.send(token);
});

module.exports = router;
