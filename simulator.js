class Simulator {
  constructor(cavasId) {
    this.canvasContext = document.getElementById(cavasId).getContext('2d');

    this.init();
  }

  init() {
    this.canvasContext.fillRect(50, 25, 150, 100);
  }
}

new Simulator('simulator');
