function sendLogs (logs) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/logs');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(logs));
}
