let ground;
let avatar;
let barriers;

let isGameOver = false;
let hasGameBegun = false;
let score = 0;

let minDistanceBetweenBarriers = 100;
let nextSpawnDistance;
let isInvincible = false;

function setup() {
  createCanvas(700, 400);
  ground = new Ground();

  resetGame();

  noLoop();
}

function resetGame() {
  score = 0;
  isGameOver = false;

  avatar = new Avatar(ground.y);
  barriers = [new Barrier(width, ground.y)];
  loop();
}

function draw() {
  background(0);

  if (barriers.length <= 0 || width - barriers[barriers.length - 1].x >= nextSpawnDistance) {
    barriers.push(new Barrier(width, ground.y));
    nextSpawnDistance = random(minDistanceBetweenBarriers, width * 1.2);
  }

  for (let i = barriers.length - 1; i >= 0; i--) {
    barriers[i].update();
    barriers[i].draw();

    if (isInvincible != true && barriers[i].checkIfCollision(avatar)) {
      isGameOver = true;
      noLoop(); 
    }

    if (barriers[i].hasScoredYet == false && barriers[i].getRight() < avatar.x) {
      barriers[i].hasScoredYet = true;
      score++;
    }

    if (barriers[i].getRight() < 0) {
      barriers.splice(i, 1);
    }
  }

  avatar.update(ground.y);
  ground.draw();
  avatar.draw();
  drawScore();
}

function drawScore() {

  fill(0, 255, 0);
  textAlign(LEFT);
  textSize(15);
  text('Score = ' + score, 10, 20);

  if (isGameOver) {

    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    textAlign(CENTER);
    textSize(35);
    fill(255 ,0, 0);
    text('Game Over', width / 2, height / 3);

    textSize(20);
    text('Press Space to play again', width / 2, height / 2);
  } else if (hasGameBegun == false) {
   
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    textAlign(CENTER);
    textSize(30);
    fill(255);
    text('Press Space to Start', width / 2, height / 3);
  }

}


function keyPressed() {
  if (key == ' ' && avatar.isOnGround()) { 
    avatar.jump();
  }

  if (isGameOver == true && key == ' ') {
    resetGame();
  } else if (hasGameBegun == false && key == ' ') {
    hasGameBegun = true;
    loop();
  }
}

class Ground extends Shape {
  constructor() {
    let yGround = height * 0.8;
    let groundHeight = ceil(height - yGround);
    super(0, yGround, width, groundHeight);
    this.fillColor = color(0, 255, 255);
  }

  draw() {
    push();
    noStroke();
    fill(this.fillColor);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

class Barrier extends Shape {
  constructor(x, yGround) {
    let barrierWidth = random(10, 30);
    let barrierHeight = random(10, 40);
    let y = yGround - barrierHeight;
    super(x, y, barrierWidth, barrierHeight);
    this.fillColor = color(200, 0, 0);
    this.speed = 6;
    this.hasScoredYet = false;
  }

  checkIfCollision(shape) {
    return this.overlaps(shape);
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    push();
    noStroke();
    fill(this.fillColor);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

class Avatar extends Shape {
  constructor(yGround) {
    let avatarHeight = 30;
    super(64, yGround - avatarHeight, 10, 15);
    this.fillColor = color(0, 255, 0);
    this.gravity = 0.9;
    this.jumpStrength = 16;
    this.yVelocity = 0;
    this.yGround = yGround;
  }

  jump() {
    this.yVelocity += -this.jumpStrength;
  }

  isOnGround() {
    return this.y == this.yGround - this.height;
  }

  update() {
    this.yVelocity += this.gravity;
    this.yVelocity *= 0.9;
    this.y += this.yVelocity;

    if (this.y + this.height > this.yGround) {
      this.y = this.yGround - this.height;
      this.yVelocity = 0;
    }
  }

  draw() {
    push();
    noStroke();
    fill(this.fillColor);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}