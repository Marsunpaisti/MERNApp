import React, { useState } from "react";
import "./sass/app.scss";
import LoginForm from "./LoginForm";
import GiveawayApp from "./GiveawayApp";
import AuthContext from "./contexts/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";

function App() {
	const [authCtx, setAuthCtx] = useState({ user: null, csrf: null, giveAwayPoints: null, giveAwayRolls: null });
	const [isAuthChecked, setIsAuthChecked] = useState(false);
	const [isCsrfToken, setIsCsrfToken] = useState(false);

	useEffect(() => {
		/**
		 * Sends a request to /api/users/me to check whether we are authenticated
		 */

		const checkAuthStatus = () => {
			axios
				.get("/api/users/me")
				.then(res => {
					console.log(res.data);
					if (res.data && res.data.ok && res.data.email) {
						setAuthCtx(prevCtx => ({
							...prevCtx,
							user: res.data.email,
							giveAwayPoints: res.data.giveAwayPoints,
							giveAwayRolls: res.data.giveAwayRolls
						}));
					}
					setIsAuthChecked(true);
					console.log(res.headers);
				})
				.catch(e => {
					console.log(e);
					console.log(e.response);
					setIsAuthChecked(true);
				});
		};

		/**
		 * Requests CSRF token from API
		 */
		const getCsrfToken = () => {
			return axios.get("/api/csrf/token").then(res => {
				axios.defaults.headers.post["XSRF-TOKEN"] = res.data;
				setAuthCtx(prevCtx => ({ ...prevCtx, csrf: res.data }));
				console.log("Set CSRF token to: " + res.data);
				setIsCsrfToken(true);
				console.log(res.headers);
			});
		};

		getCsrfToken().then(checkAuthStatus);
	}, []);

	// Auth check or CSRF retrieval in progress -> Render loading spinner
	// Not authed -> Render login screen
	// Authed -> Render giveaway application
	return (
		<>
			<div className="container">
				<div className="row">
					<div className="col-md-6 align-self-center center-column">
						<AuthContext.Provider value={{ authCtx, setAuthCtx }}>
							{isAuthChecked && isCsrfToken ? (
								<>{authCtx.user ? <GiveawayApp /> : <LoginForm />}</>
							) : (
								<div align="Center">
									<RingLoader />
								</div>
							)}
						</AuthContext.Provider>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
