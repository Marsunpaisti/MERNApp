const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const config = require("./config/default");
const users = require("./routes/api/users");
const csrf = require("./routes/api/csrf");
const requireJwtAuth = require("./utils/authmiddleware");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const helmet = require("helmet");
const csurf = require("csurf");

const app = express();

//Read .env file
dotenv.config();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
	csurf({
		cookie: true,
		maxAge: 60 * 60 * 6 //6 Hours
	})
);

//Routes
app.use("/api/users/", users);
app.use("/api/csrf/", csrf);

//Establish MongoDB connection
mongoose
	.connect(process.env.MONGOSTRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("MongoDB connected");
		//Start server
		const port = process.env.PORT || 5000;
		app.listen(port, () => {
			console.log(`Server started on port ${port}`);
			createAdminUser();
		});
	})
	.catch(err => {
		console.log(err);
	});

const createAdminUser = () => {
	User.findOne({ userType: "admin" }).then(result => {
		if (!result) {
			let adminUser = new User({
				email: process.env.ADMIN_USER,
				password: process.env.ADMIN_PASS,
				userType: "admin"
			});
			adminUser
				.save()
				.then(() => {
					console.log("Created admin user");
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			console.log("Admin user exists already");
		}
	});
};
