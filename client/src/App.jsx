import React, { useState } from "react";
import "./sass/app.scss";
import LoginForm from "./LoginForm";
import CSRFGrabber from "./CSRFGrabber";
import AuthContext from "./contexts/AuthContext";
import AuthChecker from "./AuthChecker";
import { useEffect } from "react";

function App() {
	const [authCtx, setAuthCtx] = useState({ user: null, csrf: null });

	return (
		<>
			<AuthContext.Provider value={{ authCtx, setAuthCtx }}>
				<CSRFGrabber />
				<AuthChecker />
				<div className="container">
					<div className="row">
						<div className="col-md-6 align-self-center center-column">
							{authCtx.user ? <h1>Logged in as {authCtx.user}!</h1> : <LoginForm />}
						</div>
					</div>
				</div>
			</AuthContext.Provider>
		</>
	);
}

export default App;
