(function () {
  serverUrl = "http://localhost:8080/";

  function makeRequest(path, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState === 4 && request.status === 200) {
        callback(request.response);
      }
    }
    request.open("GET", serverUrl + path)
    request.send(null)
  }

  function sendCommand(command, callback) {
    makeRequest(command, callback)
  }

  function getStats(callback) {
    makeRequest("stats", callback)
  }

  window.droneApi = {
    getStats: getStats,
    sendCommand: sendCommand,
  }
})();