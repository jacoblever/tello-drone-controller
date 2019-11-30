let prevTimestamp;

(function () {
  function tick(newTimestamp) {
    if (!prevTimestamp) {
      prevTimestamp = newTimestamp;
    }
    const timeDelta = (newTimestamp - prevTimestamp) / 1000;
    prevTimestamp = newTimestamp;

    eventManager.publish("onTick", timeDelta);

    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);
})();
