const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

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

module.exports = Counter = mongoose.model('counter', CounterSchema);
