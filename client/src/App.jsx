import React, { useState } from "react";
import "./sass/app.scss";
import LoginForm from "./LoginForm";
import AuthContext from "./contexts/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";

function App() {
	const [authCtx, setAuthCtx] = useState({ user: null, csrf: null });
	const [isAuthChecked, setIsAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuthStatus = () => {
			console.log("Retrieving authentication info");
			axios
				.get("/api/users/me")
				.then(res => {
					if (res.data && res.data.ok && res.data.email) {
						setAuthCtx(prevCtx => ({ ...prevCtx, user: res.data.email }));
					}
					setIsAuthChecked(true);
				})
				.catch(e => {
					console.log(e);
					console.log(e.response);
					setIsAuthChecked(true);
				});
		};

		const getCsrfToken = () => {
			axios.get("/api/csrf/token").then(res => {
				axios.defaults.headers.post["XSRF-TOKEN"] = res.data;
				setAuthCtx(prevCtx => ({ ...prevCtx, csrf: res.data }));
				console.log("Set CSRF token to: " + res.data);
			});
		};

		getCsrfToken();
		checkAuthStatus();
	});

	return (
		<>
			<div className="container">
				<div className="row">
					<div className="col-md-6 align-self-center center-column">
						<AuthContext.Provider value={{ authCtx, setAuthCtx }}>
							{isAuthChecked ? (
								<>{authCtx.user ? <h1>Logged in as {authCtx.user}!</h1> : <LoginForm />}</>
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
