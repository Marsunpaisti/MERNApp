import { useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./contexts/AuthContext";

/** 
Grabs the CSRF token from server API and sets it as default header for future requests 
*/
function CSRFGrabber() {
	const { authCtx, setAuthCtx } = useContext(AuthContext);

	useEffect(() => {
		if (authCtx.csrf) return; //Dont fetch if we have a csrf token
		console.log("Fetching csrf token, current: " + authCtx.csrf);
		axios.get("/api/csrf/token").then(res => {
			axios.defaults.headers.post["XSRF-TOKEN"] = res.data;
			setAuthCtx({ csrf: res.data, user: authCtx.user });
			console.log("Set CSRF token to: " + res.data);
		});
	}, [authCtx, setAuthCtx]);
	return null;
}

export default CSRFGrabber;
