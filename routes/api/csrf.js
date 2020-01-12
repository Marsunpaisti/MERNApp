const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const jwtAuth = require("../../utils/jwtauth");
const auth = require("../../utils/authmiddleware");

//Sends CSURF token and cookie to client
router.get("/token", (req, res) => {
	let token = req.csrfToken();
	res.setHeader("Set-Cookie", `XSRF-TOKEN=${token};max-age=10800;HttpOnly`);
	res.send(token);
});

module.exports = router;
