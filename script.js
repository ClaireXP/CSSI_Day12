/* ____    ___       _      _       ____  
  / ___|  / _ \     / \    | |     / ___| 
 | |  _  | | | |   / _ \   | |     \___ \ 
 | |_| | | |_| |  / ___ \  | |___   ___) |
  \____|  \___/  /_/   \_\ |_____| |____/ 
                       
1) 

  ____    _____   ____    _____   _____    ____   _   _ 
 / ___|  |_   _| |  _ \  | ____| |_   _|  / ___| | | | |
 \___ \    | |   | |_) | |  _|     | |   | |     | |_| |
  ___) |   | |   |  _ <  | |___    | |   | |___  |  _  |
 |____/    |_|   |_| \_\ |_____|   |_|    \____| |_| |_|

1) Have the frame rate go up slowly, increasing the speed the more apples you collect.
2) Make it possible to lose lives by hitting the walls.
3) Have obstacles occasionally show up. If you hit one, you die.
4) Add power-ups.
5) Add color to the tail in some creative way.
6) Put Apples on a timer, and have them expire after a certain amount of time.
7) Color code the Apples, and make each color worth a different point value.

*/

// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background
 *    colorMode, HSB
 *    frameRate,
 *    width, height,
 *    rect, ellipse,
 *    stroke, noStroke, noFill, fill, text,
 *    keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW
 *    random,
 *    collideRectCircle, collideRectRect
 */

let backgroundColor, player, currentApple, score;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;

  restartGame();
}

function draw() {
  background(backgroundColor);
  // The snake performs the following four methods:
  player.moveSelf();
  player.showSelf();
  // player.checkCollisions();
  player.checkApples();
  // The apple needs fewer methods to show up on screen.
  currentApple.showSelf();
  // We put the score in its own function for readability.
  displayScore();
}

function displayScore() {
  noStroke();
  fill("black");
  text(`Score: ${score}`, 5, 15);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width / 2;
    this.y = height - 10;
    this.direction = "N";
    this.speed = 12;
  }

  moveSelf() {
    if (this.direction === "N") {
      this.y -= this.speed;
    } else if (this.direction === "S") {
      this.y += this.speed;
    } else if (this.direction === "E") {
      this.x += this.speed;
    } else if (this.direction === "W") {
      this.x -= this.speed;
    } else {
      console.log("Error: invalid direction");
    }
  }

  showSelf() {
    stroke("black");
    fill("green");
    rect(this.x, this.y, this.size, this.size);
    noStroke();
  }

  checkApples() {
    let eating = collideRectCircle(
      this.x,
      this.y,
      this.size,
      this.size,
      currentApple.x,
      currentApple.y,
      currentApple.size
    );
    
    if(eating){
      score++;
      currentApple.respawn();
    }
  }

  checkCollisions(body) {
    let hit = collideRectRect(
      this.x, this.y, this.size, this.size,
      body.x, body.y, body.size
    );
  }

  extendTail() {}
}

class body {
  constructor(){
    
  }
}

class Apple {
  constructor() {
    this.size = 10;
    this.x = random(width-this.size);
    this.y = random(height-this.size);
  }

  showSelf() {
    stroke("black");
    fill("red");
    ellipse(this.x, this.y, this.size);
  }
  
  respawn() {
    this.x = random(width-this.size);
    this.y = random(height-this.size);
  }
}

function keyPressed() {
  console.log("key pressed: ", keyCode);
  if (keyCode === UP_ARROW && player.direction != "S") {
    player.direction = "N";
  } else if (keyCode === DOWN_ARROW && player.direction != "N") {
    player.direction = "S";
  } else if (keyCode === RIGHT_ARROW && player.direction != "W") {
    player.direction = "E";
  } else if (keyCode === LEFT_ARROW && player.direction != "E") {
    player.direction = "W";
  } else {
    console.log("wrong key");
  }
}

function restartGame() {
  frameRate(12);
  player = new Snake();
  currentApple = new Apple();
  score = 0;
}

function gameOver() {}
