const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const config = require('./config/default');
const users = require('./routes/api/users');
const requireJwtAuth = require('./utils/authmiddleware');
const cookieParser = require('cookie-parser');

const app = express();

//Read .env file
dotenv.config();

//Establish MongoDB connection
mongoose
	.connect(process.env.MONGOSTRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('MongoDB connected');
	})
	.catch(err => {
		console.log(err);
	});

//Express included body-parser
app.use(express.json());
app.use(cookieParser);

//Routes
app.use('/api/users/', users);

//Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
