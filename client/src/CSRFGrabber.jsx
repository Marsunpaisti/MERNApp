import React, { useEffect } from "react";
import axios from "axios";

/** 
Grabs the CSRF token from server API and sets it as default header for future requests 
*/
function CSRFGrabber() {
	useEffect(() => {
		axios.get("/api/csrf/token").then(res => {
			axios.defaults.headers.post["XSRF-TOKEN"] = res.data;
		});
	});
	return <></>;
}

export default CSRFGrabber;
