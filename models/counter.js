const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const CounterSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	value: {
		type: Number,
		default: 0
	}
});

CounterSchema.plugin(uniqueValidator);

CounterSchema.pre("save", function(next) {
	var counter = this;
	counter.name = counter.name.toLowerCase();
	return next();
});

module.exports = Counter = mongoose.model("counter", CounterSchema);
