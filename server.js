const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const config = require("./config/default");
const users = require("./routes/api/users");
const csrf = require("./routes/api/csrf");
const requireJwtAuth = require("./utils/authmiddleware");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const Counter = require("./models/counter");
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
			createGiveawayCounter();
		});
	})
	.catch(err => {
		console.log(err);
	});

/** 
 Creates the admin user specified in .env unless a user with admin role exists
 */
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

/** 
 Creates the mongoose Counter document to track giveaway button clicks if it does not exist
 */
const createGiveawayCounter = () => {
	Counter.findOne({ id: "GIVEAWAY_COUNTER" }).then(result => {
		if (!result) {
			let giveawayCounter = new Counter({
				id: "GIVEAWAY_COUNTER",
				value: 0
			});
			giveawayCounter
				.save()
				.then(() => {
					console.log("Initialized giveaway counter");
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			console.log("Giveaway counter exists with value " + result.value);
		}
	});
};
