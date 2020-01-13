import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import AuthContext from "./contexts/AuthContext";
import "./sass/GiveawayApp.scss";
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

	const onLogoutClick = () => {
		axios
			.post("/api/users/logout")
			.then(res => {
				setAuthCtx({ user: null, token: null, giveAwayPoints: null, giveAwayScore: null });
			})
			.catch(e => {
				if (e.response.data && e.response.data.error && e.response.data.error.message)
					console.log(e.response.data.error.message);
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

	/**
	 * Renders giveaway button that is disabled/enabled depending on roll attempts left
	 */
	const giveawayButton = () => {
		if (authCtx.giveAwayRolls <= 0) {
			return (
				<Button variant="primary" type="button" onClick={onGiveawayClick} disabled>
					Roll!
				</Button>
			);
		}
		return (
			<Button variant="primary" type="button" onClick={onGiveawayClick}>
				Roll!
			</Button>
		);
	};

	return (
		<>
			<div id="giveaway-card" className="giveaway-card card">
				<div className="logout-container d-inline">
					<p className="d-inline">Logged in as {authCtx.user}!</p>
					<Button
						variant="primary"
						type="button"
						className="btn btn-sm btn-danger d-inline float-right"
						onClick={onLogoutClick}
					>
						Logout
					</Button>
				</div>
				<br></br>
				<h2>Your score: {authCtx.giveAwayPoints}</h2>
				<br></br>
				<h2>Rolls left: {authCtx.giveAwayRolls}</h2>
				{giveawayButton()}
			</div>
			{loadSpinnerOrMessage()}
		</>
	);
}

export default GiveawayApp;
