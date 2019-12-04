function sendCommand(command) {
  setStatus("Sending...");
  window.droneApi.sendCommand(command, function (response) {
    setStatus(response);
  })
}
function setStatus(text) {
  statusDiv = document.getElementById("status");
  statusDiv.innerHTML = text;
}
function updateStats() {
  window.droneApi.getStats(function (stats) {
    statsDiv = document.getElementById("stats");
    statsDiv.innerHTML = stats;
    setTimeout(updateStats, 100);
  });
}
function sendTextCommand(input) {
  if (event.keyCode == 13) { // enter key
    sendCommand(input.value);
    input.value = "";
  }
}
function handleKeyDown(e) {
  e = e || window.event;
  if (e.keyCode == '38') { // up arrow
    sendCommand('forward 100')
  }
  else if (e.keyCode == '40') { // down arrow
    sendCommand('back 100')
  }
  else if (e.keyCode == '37') { // left arrow
    sendCommand('left 100')
  }
  else if (e.keyCode == '39') { // right arrow
    sendCommand('right 100')
  }
}
function moveDrone(direction) {
  const drone = document.getElementById("drone")
  drone.classList.add("horizTranslate")
}
(function () {
  updateStats();
  document.onkeydown = handleKeyDown;
})();