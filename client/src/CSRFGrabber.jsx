import { useEffect } from "react";
import axios from "axios";

/** 
Grabs the CSRF token from server API and sets it as default header for future requests 
*/
function CSRFGrabber() {
	useEffect(() => {
		console.log("Fetching token");
		axios.get("/api/csrf/token").then(res => {
			axios.defaults.headers.post["XSRF-TOKEN"] = res.data;
			console.log("Set CSRF token to: " + res.data);
		});
	});
	return null;
}

export default CSRFGrabber;
