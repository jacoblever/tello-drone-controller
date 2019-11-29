const gridSize = 20;

class Simulator {
  constructor(canvasId) {
    this.simulatorContainerElement = document.getElementById(canvasId);

    this.init();
  }

  init() {
    this.initCanvases();

    this.renderBackground();

    eventManager.subscribe("sendCommand", (commandString) => {
      const [command, args] = commandString.split(" ");
      this.simulateCommand(command, args);
    });
  }

  initCanvases() {
    this.createCanvas('backgroundCanvas');
    this.createCanvas('rulerCanvas');
  }

  createCanvas(canvasName) {
    const canvasElement = document.createElement('canvas');
    canvasElement.setAttribute('id', canvasName);
    canvasElement.setAttribute('width', this.simulatorContainerElement.getAttribute('width'));
    canvasElement.setAttribute('height', this.simulatorContainerElement.getAttribute('height'));
    this[canvasName] = this.simulatorContainerElement.appendChild(canvasElement);
    this[`${canvasName}Context`] = this[canvasName].getContext('2d');
  }

  renderBackground() {
    this.backgroundCanvasContext.fillStyle = this.simulatorContainerElement.getAttribute('backgroundColor') || "#f0f0f0";
    this.backgroundCanvasContext.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
    this.backgroundCanvasContext.fillStyle = this.simulatorContainerElement.getAttribute('gridColor') || "#ccc";
    this.renderGrid();
  }

  renderGrid() {
    for (var x = 0; x < this.backgroundCanvas.width; x += gridSize) {
      this.backgroundCanvasContext.moveTo(x, 0);
      this.backgroundCanvasContext.lineTo(x, this.backgroundCanvas.height);
    }
    
    for (var y = 0; y < this.backgroundCanvas.height; y += gridSize) {
      this.backgroundCanvasContext.moveTo(0, y);
      this.backgroundCanvasContext.lineTo(this.backgroundCanvas.width, y);
    }

    this.backgroundCanvasContext.strokeStyle = "#ddd";
    this.backgroundCanvasContext.stroke();
  }

  simulateCommand(command, args) {
    console.warn('### simulateCommand', command, args);
    switch (command) {
      case 'start': {
        break;
      }
      case 'takeoff': {
        break;
      }
      case 'land': {
        break;
      }
      case 'emergency': {
        break;
      }
      case 'streamon': {
        break;
      }
      case 'streamoff': {
        break;
      }
      case 'forward': {
        break;
      }
      case 'back': {
        break;
      }
      case 'left': {
        break;
      }
      case 'right': {
        break;
      }
      case 'up': {
        break;
      }
      case 'down': {
        break;
      }
      case 'CCW': {
        break;
      }
      case 'CW': {
        break;
      }
      case 'flip': {
        break;
      }
      default:
        console.warn(`Command can't be simulated`, command);
    }
  }
}

new Simulator('simulator');
