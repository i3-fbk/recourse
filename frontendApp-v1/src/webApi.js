import axios from "axios";

 const defaultSettings = {
		REACT_APP_DEV_RECOURSE_ENDPOINT: "http://localhost:5000",
		REACT_APP_RECOURSE_ENDPOINT: "https://prod-local:5000",
		REACT_APP_RECOURSE_LOG_ENDPOINT: "http://localhost:3004"
 };
export const settings = { ...defaultSettings, ...process.env };

export const recourseFareWebApi = axios.create({
	baseURL:
		process.env.NODE_ENV === "production"
			? settings.REACT_APP_RECOURSE_ENDPOINT
			: settings.REACT_APP_DEV_RECOURSE_ENDPOINT,
	timeout: 1000 * 3 * 60,
	//headers: { "Content-Type": "application/json" },
});

export const recourseLogWebApi = axios.create({
	baseURL: settings.REACT_APP_RECOURSE_LOG_ENDPOINT,
	timeout: 1000 * 3 * 60,
	//headers: { "Content-Type": "application/json" },
});


export function printEnvs(){
	console.log( `envs:  ${JSON.stringify(settings)}`)
}



