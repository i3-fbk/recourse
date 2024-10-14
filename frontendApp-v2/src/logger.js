import { useScrollTrigger } from "@mui/material";
import {recourseLogWebApi} from  "./webApi.js";

let logs = [];
  

export async function logEvent(userId, event, parameter) {


  const timestamp = new Date().toISOString();

  const log = {
		timestamp: timestamp,
		"user ID": userId,
    userID: userId,
		uiVersion: "2",
		event: event,
		parameter: parameter,
  };
 
  logs.push(log);
  await recourseLogWebApi.post("/api-v2/uilogger/store", log);
  //console.log('LOGS',logs)
}

export function getAllLogs() {
  return logs;
}

export function clearLogs() {
  logs.length = 0;
}

