const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Counter = require("../../models/counter");
const auth = require("../../utils/authmiddleware");

/** 
 Rolls the giveaway for a given user and increments the counter
 */
router.post("/roll", auth.requireMinimumRole("user"), async (req, res) => {
	//First find the user
	let user = null;
	try {
		user = await User.findOne({ _id: req.session.uid }).exec();
	} catch (e) {
		return res.json({ ok: false, error: e });
	}

	if (!user) return res.json({ ok: false, error: { message: "User not found." } });

	try {
		//Check that user has giveaway roll attempts left
		if (user.giveAwayRolls <= 0) {
			return res.json({
				ok: false,
				error: { message: "You have no rolls left!" },
				giveAwayPoints: user.giveAwayPoints,
				giveAwayRolls: user.giveAwayRolls
			});
		}

		//Find the counter and increment it
		let giveawayCounter = await Counter.findOne({ name: "giveaway_counter" }).exec();
		giveawayCounter.value += 1;
		let newValue = giveawayCounter.value;

		//Check prize for new counter value, add score to player and expend one roll attempt
		let points = checkPrize(newValue);
		user.giveAwayRolls -= 1;
		user.giveAwayPoints += points;

		user.save();
		giveawayCounter.save();

		res.json({
			ok: true,
			prizeMessage: "You won " + points + " points!",
			giveAwayPoints: user.giveAwayPoints,
			giveAwayRolls: user.giveAwayRolls
		});
	} catch (e) {
		return res.json({ ok: false, error: e });
	}
});

function checkPrize(counterValue) {
	console.log("Counter at value " + counterValue);
	if (counterValue % 500 === 0) {
		return 250;
	} else if (counterValue % 100 === 0) {
		return 40;
	} else {
		return 5;
	}
}

module.exports = router;
