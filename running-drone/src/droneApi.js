/*
  The Drone API
  -------------
  Some helper functions that make a request to the Tello Drone API
*/
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

  function sendCommand(command, callback = () => {}) {
    makeRequest(command, callback)
  }

  function getStats(callback = () => {}) {
    makeRequest("stats", (response) => {
      obj = JSON.parse(response);
      callback(obj);
    });
  }

  window.droneApi = {
    getStats: getStats,
    sendCommand: sendCommand,
  }
})();
