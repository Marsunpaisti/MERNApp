const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const CounterSchema = new Schema({
	id: {
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
	counter.id = counter.id.toLowercase();
	return next();
});

module.exports = Counter = mongoose.model("counter", CounterSchema);
