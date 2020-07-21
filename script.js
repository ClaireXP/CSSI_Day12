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
 *    loop, noLoop
 *    getItem, storeItem
 *    millis
 */

let backgroundColor, player, currentApple, score, highScore, hazards, power;

function setup() {
  // Canvas & color settings
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;

  let highscore = getItem("highscore");
  if (highscore != null) highScore = highscore;
  else highScore = 0;

  restartGame();
}

function draw() {
  background(backgroundColor);
  // The snake performs the following four methods:
  player.moveSelf();
  player.checkCollisions();
  player.showSelf();
  player.checkApples();
  // The apple needs fewer methods to show up on screen.
  currentApple.showSelf();
  
  for(const h of hazards) h.showSelf();
  power.showSelf();
  
  // We put the score in its own function for readability.
  displayScore();
  frameRate(12 + player.tail.length * 0.5);
}

function displayScore() {
  noStroke();
  fill("black");
  text(`Score: ${score}`, 5, 15);

  if (score > highScore) highScore = score;
  text(`High Score: ${highScore}`, 5, 30);
}

class Snake {
  constructor() {
    this.size = 10;
    this.x = width / 2;
    this.y = height - 10;
    this.direction = "N";
    this.speed = 12;
    this.tail = [];
  }

  moveSelf() {
    this.tail.unshift(new body(this.x, this.y));
    this.tail.pop();

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

    for (let i = 0; i < this.tail.length; i++) this.tail[i].showSelf(i);
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

    if (eating) {
      score += currentApple.value;
      currentApple.respawn();
      this.tail.push(new body(this.x, this.y));
    }
  }

  checkCollisions() {
    if (this.tail.length > 2) {
      for (const t of this.tail) if (this.x == t.x && this.y == t.y) gameOver();
    }

    if (this.x < 0 || this.x > width - this.size) gameOver();
    if (this.y < 0 || this.y > width - this.size) gameOver();
    
    for (const h of hazards){
      let hit = collideRectRect(
        this.x,
        this.y,
        this.size,
        this.size,
        h.x,
        h.y,
        h.size,
        h.size,
      ); if (hit) gameOver();
    } 
    
    let s = collideRectCircle(
      this.x,
      this.y,
      this.size,
      this.size,
      currentApple.x,
      currentApple.y,
      currentApple.size
    );

    if (eating) {
      score += currentApple.value;
      currentApple.respawn();
      this.tail.push(new body(this.x, this.y));
    }
  }
}

class body {
  constructor(x, y) {
    this.size = 9;
    this.x = x;
    this.y = y;
  }

  showSelf(i) {
    noStroke();
    if (i % 2 == 0) fill("black");
    else fill("green");
    rect(this.x, this.y, this.size, this.size);
    noStroke();
  }
}

class Apple {
  constructor() {
    this.size = 10;
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.ms = millis() + 10 * 1000;
    this.value = random([1, 1, 1, 1, 1, 3, 3, 3, 5]);
  }

  showSelf() {
    stroke("black");
    if (this.value == 5) fill("red");
    else if (this.value == 3) fill("orange");
    else fill("yellow");
    ellipse(this.x, this.y, this.size);

    if (millis() >= this.ms) this.respawn();
  }

  respawn() {
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.value = random([1, 1, 1, 1, 1, 3, 3, 3, 5]);
    this.ms = millis() + 10 * 1000;
  }
}

class powerUp {
  constructor() {
    this.size = 10;
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.ms = millis() + 10 * 1000;
  }

  showSelf() {
    noStroke();
    fill("black");
    rect(this.x, this.y, this.size, this.size);

    if (millis() >= this.ms) this.respawn();
  }

  respawn() {
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.ms = millis() + 10 * 1000;
  }
}

class hazard {
  constructor() {
    this.size = 10;
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.ms = millis() + 10 * 1000;
  }

  showSelf() {
    stroke("black");
    noFill();
    rect(this.x, this.y, this.size, this.size);

    if (millis() >= this.ms) this.respawn();
  }

  respawn() {
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.ms = millis() + 10 * 1000;
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

  hazards = [];
  for (let i = 0; i < 3; i++) hazards.push(new hazard());
  
  power = new powerUp();

  score = 0;
}

function gameOver() {
  noLoop();
  storeItem("highscore", highScore);
}
