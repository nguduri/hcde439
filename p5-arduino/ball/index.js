
const BAUD_RATE = 9600;
const MIN_DIAMETER = 10;
const MAX_DIAMETER = 40;

let port, connectBtn;

// Store the ball's position
let ballX;
let ballY;

function setup() {
  setupSerial();

  createCanvas(windowWidth, windowHeight);

  // Start ball in center
  ballX = windowWidth / 2;
  ballY = windowHeight / 2;
}

function draw() {
  const portIsOpen = checkPort();
  if (!portIsOpen) return;

  let str = port.readUntil("\n");
  if (str.length == 0) return;

  let arr = str.trim().split(",");

  // Read joystick and potentiometer
  let joyX = Number(arr[0]);
  let joyY = Number(arr[1]);
  let pot = Number(arr[2]);

  // Movement sensitivity
  let speed = 15;
  let deadzone = 40;

  // Move left and right
  if (Math.abs(joyX - 512) > deadzone) {
    ballX += ((joyX - 512) / 512) * speed;
  }

  // Move up and down
  if (Math.abs(joyY - 512) > deadzone) {
    ballY += ((joyY - 512) / 512) * speed;
  }

  // Keep ball inside the screen
  ballX = constrain(ballX, 20, windowWidth - 20);
  ballY = constrain(ballY, 20, windowHeight - 20);

  // Potentiometer controls ball size
  let diameter = map(pot, 0, 1023, MIN_DIAMETER, MAX_DIAMETER);

  // Draw ball
  background("gray");
  fill("dodgerblue");
  stroke("black");
  circle(ballX, ballY, diameter);
}

// Serial connection functions

function setupSerial() {
  port = createSerial();

  let usedPorts = usedSerialPorts();

  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_RATE);
  }

  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5);
  connectBtn.mouseClicked(onConnectButtonClicked);
}

function checkPort() {
  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
    background("gray");
    return false;
  } else {
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  if (!port.opened()) {
    port.open(BAUD_RATE);
  } else {
    port.close();
  }
}
