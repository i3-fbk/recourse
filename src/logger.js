import React from "react";
import axios, * as others from "axios";


const logs = [];
 
export function logEvent(userId, event, parameter) {
  const timestamp = new Date().toISOString();

  const defaultLink = 'http://127.0.0.1:5000'
  const log = {
      "timestamp" : timestamp,
      "user ID": userId,
      "event": event,
      "parameter": parameter
  }

  logs.push(log);
 

  axios
  .post(`${defaultLink}/insert_logs`, log)
  .then((res) => {
      console.log(`Server responded with status code ${res.status}`);
  })
  .catch((err) => {
    console.error("Error:", err);
  });

}

export function getAllLogs() {
  return logs;
}

export function clearLogs() {
  logs.length = 0;
}
