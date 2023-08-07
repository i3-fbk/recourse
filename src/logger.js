
const logs = [];
 console.log('logs',logs)
export function logEvent(userId, event, parameter) {
  const timestamp = new Date().toISOString();

  const log = {
      "timestamp" : timestamp,
      "user ID": userId,
      "event": event,
      "parameter": parameter
  }

  logs.push(log);
  console.log('logs',logs)
}

export function getAllLogs() {
  return logs;
}

export function clearLogs() {
  logs.length = 0;
}
