class Simulator {
  constructor(cavasId) {
    this.canvasContext = document.getElementById(cavasId).getContext('2d');

    this.init();
  }

  init() {
    this.canvasContext.fillRect(50, 25, 150, 100);

    eventManager.subscribe("sendCommand", (commandString) => {
      const [command, args] = commandString.split(" ");
      this.simulateCommand(command, args);
    });
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
