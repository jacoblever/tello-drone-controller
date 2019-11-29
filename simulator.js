const gridSize = 20;

class Simulator {
  constructor(cavasId) {
    this.canvas = document.getElementById(cavasId);
    this.canvasContext = this.canvas.getContext('2d');

    this.init();
  }

  init() {
    this.renderBackground();

    eventManager.subscribe("sendCommand", (commandString) => {
      const [command, args] = commandString.split(" ");
      this.simulateCommand(command, args);
    });
  }

  renderBackground() {
    this.canvasContext.fillStyle = this.canvas.getAttribute('backgroundColor') || "#f0f0f0";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.fillStyle = this.canvas.getAttribute('gridColor') || "#ccc";
    this.renderGrid();
  }

  renderGrid() {
    for (var x = 0; x < this.canvas.width; x += gridSize) {
      this.canvasContext.moveTo(x, 0);
      this.canvasContext.lineTo(x, this.canvas.height);
    }
    
    for (var y = 0; y < this.canvas.height; y += gridSize) {
      this.canvasContext.moveTo(0, y);
      this.canvasContext.lineTo(this.canvas.width, y);
    }

    this.canvasContext.strokeStyle = "#ddd";
    this.canvasContext.stroke();
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
