function handleKeyDown(e) {
  e = e || window.event;
  if (e.keyCode == '38') { // up arrow
    sendCommand('forward 100')
  } else if (e.keyCode == '40') { // down arrow
    sendCommand('back 100')
  } else if (e.keyCode == '37') { // left arrow
    sendCommand('left 100')
  } else if (e.keyCode == '39') { // right arrow
    sendCommand('right 100')
  }
}

(function () {
  document.onkeydown = handleKeyDown;
})();
