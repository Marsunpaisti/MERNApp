import React from "react";
import "./sass/app.scss";
import LoginForm from "./LoginForm";
import CSRFGrabber from "./CSRFGrabber";

function App() {
	return (
		<>
			<CSRFGrabber></CSRFGrabber>
			<div className="container">
				<div className="row">
					<div className="column align-self-center center-column">
						<LoginForm />
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
