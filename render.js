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

(function () {
  updateStats();
})();
