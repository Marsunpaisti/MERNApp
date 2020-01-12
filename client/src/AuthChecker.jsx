import { useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "./contexts/AuthContext";

/**
 * Asks the API /users/me/ endpoint whether we are authenticated and store result in auth context
 */
function AuthChecker() {
	const { authCtx, setAuthCtx } = useContext(AuthContext);

	useEffect(() => {
		if (authCtx.user) return; //Dont fetch if we already have the information
		if (!authCtx.csrf) return; //Dont fetch before we have a csrf token
		console.log("Auth check");
		axios
			.get("/api/users/me")
			.then(res => {
				if (res.data && res.data.ok && res.data.email) {
					setAuthCtx({ csrf: authCtx.csrf, user: res.data.email });
				}
			})
			.catch(e => {
				console.log(e);
				console.log(e.response);
			});
	}, [authCtx.csrf, authCtx.user, setAuthCtx]);
	return null;
}

export default AuthChecker;
