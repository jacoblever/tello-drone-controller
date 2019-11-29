const gridSize = 100;
const droneSize = {
  width: 98,
  length: 93,
  height: 41,
};

class Simulator {
  constructor(canvasId) {
    this.simulatorContainerElement = document.getElementById(canvasId);
    this.droneX = this.simulatorContainerElement.getAttribute('width') / 2; //center
    this.droneY = this.simulatorContainerElement.getAttribute('height') / 2; //center

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
    this.simulatorContainerElement.style.position = 'relative';
    this.createCanvas('backgroundCanvas');
    this.createCanvas('droneCanvas');
  }

  createCanvas(canvasName) {
    const canvasElement = document.createElement('canvas');
    canvasElement.setAttribute('id', canvasName);
    canvasElement.setAttribute('width', this.simulatorContainerElement.getAttribute('width'));
    canvasElement.setAttribute('height', this.simulatorContainerElement.getAttribute('height'));
    canvasElement.style.position = 'absolute';
    canvasElement.style.top = '0';
    canvasElement.style.right = '0';
    canvasElement.style.bottom = '0';
    canvasElement.style.left = '0';
    this[canvasName] = this.simulatorContainerElement.appendChild(canvasElement);
    this[`${canvasName}Context`] = this[canvasName].getContext('2d');
  }

  renderBackground() {
    this.backgroundCanvasContext.fillStyle = this.simulatorContainerElement.getAttribute('backgroundColor') || "#f0f0f0";
    this.backgroundCanvasContext.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
    this.backgroundCanvasContext.fillStyle = this.simulatorContainerElement.getAttribute('gridColor') || "#ccc";
    this.renderGrid();
    this.renderDrone();
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

  renderDrone() {
    this.droneCanvasContext.fillStyle = "#333";
    this.droneCanvasContext.moveTo(this.droneX, this.droneY - droneSize.length/2); //top center
    this.droneCanvasContext.lineTo(this.droneX + droneSize.width/2, this.droneY + droneSize.length/2);
    this.droneCanvasContext.lineTo(this.droneX, this.droneY + droneSize.length/4); //top center
    this.droneCanvasContext.lineTo(this.droneX - droneSize.width/2, this.droneY + droneSize.length/2);
    this.droneCanvasContext.fill();
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
