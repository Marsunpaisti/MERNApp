import React, { useEffect } from "react";
import axios from "axios";

function CSRFGrabber() {
	useEffect(() => {
		axios.get("/api/csrf").then(res => {
			axios.defaults.headers.post["X-XSRF-TOKEN"] = res.data;
		});
	});
	return <></>;
}

export default CSRFGrabber;
