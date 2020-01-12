import React, { useState } from "react";
import "./sass/app.scss";
import LoginForm from "./LoginForm";
import CSRFGrabber from "./CSRFGrabber";
import AuthContext from "./contexts/AuthContext";

function App() {
	const [authCtx, setAuthCtx] = useState({ token: "123", user: "321" });
	return (
		<>
			<AuthContext.Provider value={{ authCtx, setAuthCtx }}>
				<CSRFGrabber />
				<div className="container">
					<div className="row">
						<div className="col-md-6 align-self-center center-column">
							<LoginForm />
						</div>
					</div>
				</div>
			</AuthContext.Provider>
		</>
	);
}

export default App;
