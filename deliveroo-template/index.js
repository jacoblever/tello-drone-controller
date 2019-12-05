function buttonClicked(command) {
  // This looks for an element on the page with the id of "response".
  // It will find the <div> we created above.
  responseBox = document.getElementById("response");

  // When we click a button we first set the content of the response box to "Loading..."
  // so we can see that we are waiting for the drone to respond.
  responseBox.innerHTML = "Loading...";

  window.droneApi.sendCommand(command, function(droneResponse) {

    // When the drone eventually responds this function will get called.
    // The response tells us what the drone said, so we set that
    responseBox.innerHTML = droneResponse;
  });
}

function updateStats() {
  window.droneApi.getStats(function(stats) {
    statsBox = document.getElementById("stats");
    statsBox.innerHTML = stats;
 
    // This will wait 200 milliseconds and then recursively call 
    // updateStats again
    setTimeout(updateStats, 200);
  });
}

// Actually call the function
updateStats();



/* NOT FOR STUDENTS BELOW HERE */
function sendTextCommand(input) {
  if (event.keyCode == 13) { // enter key
    buttonClicked(input.value);
    input.value = "";
  }
}

function handleKeyDown(e) {
  e = e || window.event;
  if (e.keyCode == '38') { // up arrow
    buttonClicked('forward 100')
  } else if (e.keyCode == '40') { // down arrow
    buttonClicked('back 100')
  } else if (e.keyCode == '37') { // left arrow
    buttonClicked('left 100')
  } else if (e.keyCode == '39') { // right arrow
    buttonClicked('right 100')
  }
}

(function () {
  document.onkeydown = handleKeyDown;
})();
