import React, { useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import "./sass/LoginForm.scss";
import axios from "axios";
import { RingLoader } from "react-spinners";
import AuthContext from "./contexts/AuthContext";

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState();
	const { authCtx, setAuthCtx } = useContext(AuthContext);

	/**
	 * Posts the form data to login API and saves the authorization response to context (and receives the jwt cookie the server sends)
	 */
	const onLoginClick = () => {
		setLoading(true);
		axios
			.post("/api/users/login", {
				email: email,
				password: password
			})
			.then(res => {
				if (res.data.ok) {
					setMessage("Logged in successfully!");
					setAuthCtx(prevCtx => ({
						...prevCtx,
						user: res.data.user,
						giveAwayPoints: res.data.giveAwayPoints,
						giveAwayRolls: res.data.giveAwayRolls
					}));
				} else {
					if (res && res.data && res.data.error && res.data.error.message) setMessage(res.data.error.message);
				}
				setLoading(false);
			})
			.catch(e => {
				console.log(e.response.data);
				if (e.response && e.response.data && e.response.data.error && e.response.data.error.message) {
					setMessage(e.response.data.error.message);
				} else {
					setMessage(e.response.data);
				}
				setLoading(false);
			});
	};
	const onRegisterClick = () => {
		setLoading(true);
		axios
			.post("/api/users/register", {
				email: email,
				password: password
			})
			.then(res => {
				setLoading(false);
				if (res.data.token) {
					setMessage("Logged in successfully!");
					setAuthCtx(prevCtx => ({
						...prevCtx,
						user: res.data.email,
						giveAwayPoints: res.data.giveAwayPoints,
						giveAwayRolls: res.data.giveAwayRolls,
						token: res.data.token
					}));
					return;
				}
				if (res && res.data && res.data.error && res.data.error.message) setMessage(res.data.error.message);
			})
			.catch(e => {
				console.log(e.response.data);
				if (e.response && e.response.data && e.response.data.error && e.response.data.error.message) {
					setMessage(e.response.data.error.message);
				} else {
					setMessage(e.response.data);
				}
				setLoading(false);
			});
	};

	const onEmailChange = e => {
		setEmail(e.target.value);
	};

	const onPasswordChange = e => {
		setPassword(e.target.value);
	};

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
			<div id="login-card" className="login-card card">
				<div id="login" className="login">
					<Form method="POST" action="/users/login">
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="email" placeholder="Enter email" onChange={onEmailChange} />
						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={onPasswordChange} />
						</Form.Group>
						<Button variant="primary" type="button" onClick={onLoginClick}>
							Login
						</Button>
						<Button variant="primary" type="button" className="register-button" onClick={onRegisterClick}>
							Register
						</Button>
					</Form>
				</div>
			</div>
			{loadSpinnerOrMessage()}
		</>
	);
}

export default LoginForm;
