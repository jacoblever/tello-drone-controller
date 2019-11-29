function sendCommand(command) {
  setStatus("Sending...");
  eventManager.publish("sendCommand", command);
  window.droneApi.sendCommand(command, function (response) {
    setStatus(response);
  })
}

function sendTextCommand(input) {
  if (event.keyCode == 13) { // enter key
    sendCommand(input.value);
    input.value = "";
  }
}
