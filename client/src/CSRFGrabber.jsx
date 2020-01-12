import React, { useEffect } from "react";
import axios from "axios";

function CSRFGrabber() {
	useEffect(() => {
		axios.get("/api/csrf/token").then(res => {
			axios.defaults.headers.post["XSRF-TOKEN"] = res.data;
		});
	});
	return <></>;
}

export default CSRFGrabber;
