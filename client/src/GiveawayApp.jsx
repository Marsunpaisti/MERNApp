import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import AuthContext from "./contexts/AuthContext";
import { useEffect } from "react";
import { RingLoader } from "react-spinners";

/**
 * Displays user giveaway score & attempts as well as button to roll for giveaway
 */
function GiveawayApp() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState();
	const { authCtx, setAuthCtx } = useContext(AuthContext);

	/**
	 * Posts to giveaway API and saves data from response
	 */
	const onGiveawayClick = () => {
		setLoading(true);
		axios
			.post("/api/giveaway/roll")
			.then(res => {
				setLoading(false);
				if (res.data && res.data.prizeMessage) setMessage(res.data.prizeMessage);

				if (res.data.ok) {
					setAuthCtx(prevCtx => ({
						...prevCtx,
						giveAwayPoints: res.data.giveAwayPoints,
						giveAwayRolls: res.data.giveAwayRolls
					}));
				}
			})
			.catch(e => {
				setLoading(false);
				if (e.response.data && e.response.data.error && e.response.data.error.message)
					setMessage(e.response.data.error.message);
			});
	};

	/**
	 * Renders either a loading spinner or a response message of request
	 */
	const loadSpinnerOrMessage = () => {
		if (loading) {
			return (
				<div className="loading-spinner" align="center">
					<RingLoader />
				</div>
			);
		} else if (message) {
			return <div className="alert alert-info message">{message}</div>;
		} else {
			return null;
		}
	};

	return (
		<>
			<div id="giveaway-card" className="giveaway-card card">
				<p>Logged in as {authCtx.user}!</p>
				<br></br>
				<p>Your score: {authCtx.giveAwayPoints}</p>
				<br></br>
				<p>Rolls left: {authCtx.giveAwayRolls}</p>
				<Button variant="primary" type="button" onClick={onGiveawayClick}>
					Roll!
				</Button>
			</div>
			{loadSpinnerOrMessage()}
		</>
	);
}

export default GiveawayApp;
