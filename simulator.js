const gridSize = 100;
const droneScale = 4;
const droneSize = {
  width: 98 / droneScale,
  length: 93 / droneScale,
  height: 41 / droneScale,
};
const droneSpeed = 10;
const droneRotationSpeed = 10;
const droneElevationSpeed = 10;
const maxElevation = 1000;

class Simulator {
  constructor(canvasId) {
    this.simulatorContainerElement = document.getElementById(canvasId);
    this.droneX = this.simulatorContainerElement.getAttribute('width') / 2; //center
    this.droneY = this.simulatorContainerElement.getAttribute('height') / 2; //center
    this.droneTargetX = this.droneX;
    this.droneTargetY = this.droneY;
    this.rotationDirection = 'clockwise';
    this.droneDirection = 0;
    this.droneTargetDirection = this.droneDirection;
    this.droneElevation = 0;
    this.droneTargetElevation = this.droneElevation;
    this.powered = false;

    this.init();
  }

  init() {
    this.initCanvases();

    this.renderBackground();
    this.renderDrone();

    eventManager.subscribe("sendCommand", (commandString) => {
      const [command, ...args] = commandString.split(" ");
      this.simulateCommand(command, args);
    });

    eventManager.subscribe("onTick", (timeDelta) => {
      if (this.powered) {
        this.moveDrone();
        this.rotateDrone();
      }
      this.elevateDrone();
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
    this.droneCanvasContext.fillStyle = this.powered ? "#5AB963" : "#333";
    this.droneCanvasContext.clearRect(0, 0, this.droneCanvas.width, this.droneCanvas.height);
    this.droneCanvasContext.save();
    this.renderDronePosition();
    this.renderDroneRotation();
    this.renderDroneElevation();
    this.renderDroneLines();
    this.droneCanvasContext.restore();
  }

  renderDroneLines() {
    this.droneCanvasContext.beginPath();
    this.droneCanvasContext.moveTo(0, -droneSize.length/2); //top center
    this.droneCanvasContext.lineTo(droneSize.width/2, droneSize.length/2); // right bottom
    this.droneCanvasContext.lineTo(0, droneSize.length/4); //bottom center
    this.droneCanvasContext.lineTo(-droneSize.width/2, droneSize.length/2); // left bottom
    this.droneCanvasContext.closePath();
    this.droneCanvasContext.fill();
  }

  renderDronePosition() {
    this.droneCanvasContext.translate(this.droneX, this.droneY);
  }

  renderDroneRotation() {
    const directionAsRadian = this.droneDirection * Math.PI/180; // Radians because JS uses radians not degrees
    this.droneCanvasContext.rotate(directionAsRadian);
  }

  renderDroneElevation() {
    const newScale = (this.droneElevation/maxElevation) * (droneScale - 1) +1; // +1 because a scale of 1 is the default, *droneScale is the max it should scale
    this.droneCanvasContext.scale(newScale, newScale);
  }

  updateDroneTargetPosition(direction, hypotenuse) {
    if (this.droneElevation > 0) { // don't move drone if it's on the floor
      const directions = ['forward', 'right', 'back', 'left'];
      const directionToMove = this.droneDirection + directions.indexOf(direction) * 90;
      const directionAsRadian = directionToMove * Math.PI/180; // Radians because JS uses radians not degrees
      const targetAmountX = Math.sin(directionAsRadian) * hypotenuse; // SOH cah toa
      const targetAmountY = Math.cos(directionAsRadian) * hypotenuse; // soh CAH toa

      this.droneTargetX = Math.floor(this.droneX + targetAmountX);
      this.droneTargetY = Math.floor(this.droneY - targetAmountY); // minus because the y is reversed in JS top to bottom
    }
  }

  updateDroneTargetDirection(rotationDirection, amount) {
    this.rotationDirection = rotationDirection;
    if (rotationDirection === 'clockwise') {
      this.droneTargetDirection = this.droneDirection + amount;
    } else if (rotationDirection === 'counterClockwise') {
      this.droneTargetDirection = this.droneDirection - amount;
    }
  }

  updateDroneTargetElevation(elevationDirection, amount) {
    if (elevationDirection === 'up') {
      this.droneTargetElevation = this.droneElevation + amount;
      if (this.droneTargetElevation > maxElevation) {
        this.droneTargetElevation = maxElevation;
      }
    } else if (elevationDirection === 'down') {
      this.droneTargetElevation = this.droneElevation - amount;
      if (this.droneTargetElevation < 0) {
        this.droneTargetElevation = 0;
      }
    }
  }

  moveDrone() {
    if (this.droneX !== this.droneTargetX || this.droneY !== this.droneTargetY) {
      const adjacent = this.droneTargetX - this.droneX; // soh CAH toa
      const opposite = this.droneTargetY - this.droneY; // SOH cah toa
      const hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));
      const framesToTravel = hypotenuse / droneSpeed;

      if (framesToTravel < 1) { // arriving at target
        this.droneX = this.droneTargetX;
        this.droneY = this.droneTargetY;
      } else { // Move the drone based on speed it can travel per frame
        const xToTravel = Math.floor(adjacent / framesToTravel);
        const yToTravel = Math.floor(opposite / framesToTravel);
        this.droneX = this.droneX + xToTravel;
        this.droneY = this.droneY + yToTravel;
      }

      this.renderDrone();
    }
  }

  rotateDrone() {
    if (this.droneDirection !== this.droneTargetDirection) {
      const framesToRotate = Math.abs(this.droneTargetDirection - this.droneDirection) / droneRotationSpeed;
      if (framesToRotate < 1) {
        this.droneDirection = this.droneTargetDirection;
      } else {
        if (this.rotationDirection === 'clockwise') {
          this.droneDirection = this.droneDirection + droneRotationSpeed;
        } else if (this.rotationDirection === 'counterClockwise') {
          this.droneDirection = this.droneDirection - droneRotationSpeed;
        }
      }

      this.renderDrone();
    }
  }

  elevateDrone() {
    if (this.droneElevation !== this.droneTargetElevation) {
      const framesToElevate = Math.abs(this.droneTargetElevation - this.droneElevation) / droneElevationSpeed;
      if (framesToElevate < 1) {
        this.droneElevation = this.droneTargetElevation;
      } else {
        if (this.droneElevation < this.droneTargetElevation) { // going up
          this.droneElevation = this.droneElevation + droneElevationSpeed;
        } else { // going down
          this.droneElevation = this.droneElevation - droneElevationSpeed;
        }
      }

      this.renderDrone();
    }
  }

  emergencyStop() {
    this.droneTargetX = this.droneX;
    this.droneTargetY = this.droneY;
    this.droneTargetDirection = this.droneDirection;
    this.droneTargetElevation = this.droneElevation;
  }

  simulateCommand(command, args) {
    if (command === 'start') {
      this.powered = !this.powered;
      if (this.droneElevation > 0) {
        this.updateDroneTargetElevation('down', maxElevation);
      }
      this.renderDrone();
    }

    if (this.powered) {
      console.warn('### simulateCommand', command, args);
      switch (command) {
        case 'takeoff': {
          if (this.droneElevation === 0) {
            this.updateDroneTargetElevation('up', 500);
          }
          break;
        }
        case 'land': {
          if (this.droneElevation > 0) {
            this.updateDroneTargetElevation('down', maxElevation);
          }
          break;
        }
        case 'emergency': {
          this.emergencyStop();
          break;
        }
        case 'streamon': {
          break;
        }
        case 'streamoff': {
          break;
        }
        case 'forward': {
          this.updateDroneTargetPosition('forward', parseInt(args[0]));
          break;
        }
        case 'back': {
          this.updateDroneTargetPosition('back', parseInt(args[0]));
          break;
        }
        case 'left': {
          this.updateDroneTargetPosition('left', parseInt(args[0]));
          break;
        }
        case 'right': {
          this.updateDroneTargetPosition('right', parseInt(args[0]));
          break;
        }
        case 'up': {
          this.updateDroneTargetElevation('up', parseInt(args[0]));
          break;
        }
        case 'down': {
          this.updateDroneTargetElevation('down', parseInt(args[0]));
          break;
        }
        case 'CCW': {
          this.updateDroneTargetDirection('counterClockwise', parseInt(args[0]));
          break;
        }
        case 'CW': {
          this.updateDroneTargetDirection('clockwise', parseInt(args[0]));
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
}

new Simulator('simulator');
