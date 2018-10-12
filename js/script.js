/******************************************************

Game - Chaser
Magdalene Papadimas

Hungry O'Brien. This game is about feeding the hungry Dylan O'Brien as many apples as you can before he fades away!

Physics-based movement, keyboard controls, health/stamina,
sprinting, random movement, screen wrap.

******************************************************/

// Track whether the game is over
var gameOver = false;

// Player position, size, velocity
var playerX;
var playerY;
var playerSize = 60;
var playerVX = 0;
var playerVY = 0;
var playerMaxSpeed;
// Player health
var playerHealth;
var playerMaxHealth = 255;
var loseHealth = -0.5;
// Player fill color
var playerFill = 50;
//speed increaser
var fastSpeed = 10;
var normalSpeed = 5;
// Prey position, size, velocity
var preyX;
var preyY;
var preySize = 35;
var preyVX;
var preyVY;
var preyMaxSpeed = 15;
// Prey health
var preyHealth;
var preyMaxHealth = 100;
// Prey fill color
var preyFill = 200;

// Amount of health obtained per frame of "eating" the prey
var eatHealth = 10;
// Number of prey eaten during the game
var preyEaten = 0;
//score
var score;
var scoreCounter = 0;
//seperates menu/game/end screen
var gameScreen = 0;

//background image

// setup()
//
// Sets up the basic elements of the game
function setup() {
  createCanvas(1920, 930);
  noStroke();

  setupPrey();
  setupPlayer();

}
function preload() {
//sounds
//animals
  appleImage = loadImage("assets/images/apple.png");
  DylanImage = loadImage("assets/images/Dylan.png");
  backgroundImage = loadImage("assets/images/background.png");
}
// setupPrey()
//
// Initialises prey's position, velocity, and health
function setupPrey() {
  preyX = width/5;
  preyY = height/2;
  preyVX = -preyMaxSpeed;
  preyVY = preyMaxSpeed;
  preyHealth = preyMaxHealth;
}

// setupPlayer()
//
// Initialises player position and health
function setupPlayer() {
  playerX = 4*width/5;
  playerY = height/2;
  playerHealth = playerMaxHealth;
}

// draw()
//
// While the game is active, checks input
// updates positions of prey and player,
// checks health (dying), checks eating (overlaps)
// displays the two agents.
// When the game is over, shows the game over screen.
function draw() {
  background(100,100,200);
  image(backgroundImage,width/1000,height/1000);
  textSize(25);
  fill(0);
  text("Apples: " +preyEaten, 810, 20);
  if (!gameOver) {
    handleInput();

    movePlayer();
    movePrey();

    updateHealth();
    checkEating();

    drawPrey();
    drawPlayer();
  }
  else {
    showGameOver();
  }
}

// handleInput()
//
// Checks arrow keys and adjusts player velocity accordingly
function handleInput() {
  // Check for horizontal movement
  if (keyIsDown(LEFT_ARROW)) {
    playerVX = -playerMaxSpeed;
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    playerVX = playerMaxSpeed;
  }
  else {
    playerVX = 0;
  }

  // Check for vertical movement
  if (keyIsDown(UP_ARROW)) {
    playerVY = -playerMaxSpeed;
  }
  else if (keyIsDown(DOWN_ARROW)) {
    playerVY = playerMaxSpeed;
  }
  else {
    playerVY = 0;
  }
// hold down shift for increase speed
  if (keyIsDown(SHIFT)) {
    playerMaxSpeed = fastSpeed;
    loseHealth = 2;
  }
  else {
    playerMaxSpeed = normalSpeed;
    loseHealth = 0.5;
  }
}

// movePlayer()
//
// Updates player position based on velocity,
// wraps around the edges.
function movePlayer() {
  // Update position
  playerX += playerVX;
  playerY += playerVY;

  // Wrap when player goes off the canvas
  if (playerX < 0) {
    playerX += width;
  }
  else if (playerX > width) {
    playerX -= width;
  }

  if (playerY < 0) {
    playerY += height;
  }
  else if (playerY > height) {
    playerY -= height;
  }
}

// updateHealth()
//
// Reduce the player's health (every frame)
// Check if the player is dead
function updateHealth() {
  // Reduce player health, constrain to reasonable range
  playerHealth = constrain(playerHealth - loseHealth,0,playerMaxHealth);
  // Check if the player is dead
  if (playerHealth === 0) {
    // If so, the game is over
    gameOver = true;
  }
}

// checkEating()
//
// Check if the player overlaps the prey and updates health of both
function checkEating() {
  // Get distance of player to prey
  var d = dist(playerX,playerY,preyX,preyY);
  // Check if it's an overlap
  if (d < playerSize + preySize) {
    // Increase the player health
    playerHealth = constrain(playerHealth + eatHealth,0,playerMaxHealth);
    // Reduce the prey health
    preyHealth = constrain(preyHealth - eatHealth,0,preyMaxHealth);

    // Check if the prey died
    if (preyHealth === 0) {
      // Move the "new" prey to a random position
      preyX = random(0,width);
      preyY = random(0,height);
      // Give it full health
      preyHealth = preyMaxHealth;
      // Track how many prey were eaten
      preyEaten++;
    }
  }
}
function score(){
  textSize(50);
  fill(0);
  text("Score: " +preyEaten, width*2, height*2);
}
// movePrey()
//
// Moves the prey based on random velocity changes
function movePrey() {
  // Change the prey's velocity at random intervals
  // random() will be < 0.05 5% of the time, so the prey
  // will change direction on 5% of frames
  if (noise(preyX,preyY) < 0.2) {

    // Set velocity based on random values to get a new direction
    // and speed of movement
    // Use map() to convert from the 0-1 range of the random() function
    // to the appropriate range of velocities for the prey
    preyVX = map(noise(preyX), 0,1,-preyMaxSpeed,preyMaxSpeed);
    preyVY = map(noise(preyY), 0,1,-preyMaxSpeed,preyMaxSpeed);
}
  // Update prey position based on velocity
  preyX += preyVX;
  preyY += preyVY;

  // Screen wrapping
  if (preyX < 0) {
    preyX += width;
  }
  else if (preyX > width) {
    preyX -= width;
  }

  if (preyY < 0) {
    preyY += height;
  }
  else if (preyY > height) {
    preyY -= height;
  }
}
// drawPrey()
//
// Draw the prey as an ellipse with alpha based on health
function drawPrey() {
  fill(preyFill,preyHealth);
  image(appleImage,preyX,preyY,preySize,preySize);
}
// drawPlayer()
//
// Draw the player as an ellipse with alpha based on health
function drawPlayer() {
  var alpha = map(playerHealth, 0,playerMaxHealth,0,255); ;
//  fill(playerFill,playerHealth
  tint(255, alpha);
  image(DylanImage,playerX,playerY,playerSize,playerSize+20);

  noTint();

}

// showGameOver()
//
// Display text about the game being over!
function showGameOver() {
  textSize(32);
  textAlign(CENTER,CENTER);
  fill(0);
  var gameOverText = "GAME OVER\n";
  gameOverText += "You ate " + preyEaten + " prey\n";
  gameOverText += "before you died."
  text(gameOverText,width/2,height/2);
}
