import React from "react";
import { Button, Form } from "react-bootstrap";
import styled from "styled-components";

function App() {
	const Styles = styled.div`
		.login {
			padding: 0.5em;
    }
    .login-column {
      margin: 5em auto 0 auto;
    }
	`;

	return (
		<Styles>
			<div className="container">
				<div className="row">
					<div className="column align-self-center login-column">
						<div id="login-card" className="card">
							<div id="login" className="login">
								<Form>
									<Form.Group controlId="formBasicEmail">
										<Form.Label>Email address</Form.Label>
										<Form.Control type="email" placeholder="Enter email" />
									</Form.Group>

									<Form.Group controlId="formBasicPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control type="password" placeholder="Password" />
									</Form.Group>
									<Button variant="primary" type="submit">
										Submit
									</Button>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Styles>
	);
}

export default App;
