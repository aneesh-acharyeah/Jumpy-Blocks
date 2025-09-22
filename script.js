// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highscoreDisplay = document.getElementById('highscore');

let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
highscoreDisplay.textContent = highscore;

let block = { x: canvas.width / 2 - 25, y: canvas.height - 50, width: 50, height: 50, velocityY: 0 };
let platforms = [];
let gameInterval, gravity = 0.5, jumpStrength = -10, platformSpeed = 2;

// Draw Functions
function drawBlock() {
  ctx.fillStyle = 'lime';
  ctx.fillRect(block.x, block.y, block.width, block.height);
}

function drawPlatforms() {
  ctx.fillStyle = 'orange';
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });
}

function drawScore() {
  scoreDisplay.textContent = score;
}

// Create Platform
function createPlatform() {
  let width = Math.random() * (canvas.width - 100) + 50;
  let x = Math.random() * (canvas.width - width);
  let y = Math.random() * 100 + canvas.height;
  platforms.push({ x, y, width, height: 20 });
}

// Move Platforms
function movePlatforms() {
  platforms.forEach(platform => {
    platform.y -= platformSpeed;
  });

  // Remove off-screen platforms
  platforms = platforms.filter(platform => platform.y + platform.height > 0);
}

// Jumping
function jump() {
  if (block.velocityY === 0) {
    block.velocityY = jumpStrength;
  }
}

// Physics
function applyGravity() {
  block.velocityY += gravity;
  block.y += block.velocityY;

  if (block.y + block.height > canvas.height) {
    block.y = canvas.height - block.height;
    block.velocityY = 0;
  }
}

// Check Platform Collision
function checkPlatformCollision() {
  platforms.forEach(platform => {
    if (
      block.x + block.width > platform.x &&
      block.x < platform.x + platform.width &&
      block.y + block.height <= platform.y &&
      block.y + block.height + block.velocityY >= platform.y
    ) {
      block.velocityY = 0;
      block.y = platform.y - block.height;
      score++;
      if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
      }
    }
  });
}

// Game Over Check
function checkGameOver() {
  if (block.y + block.height >= canvas.height) {
    clearInterval(gameInterval);
    alert('Game Over! Score: ' + score);
    resetGame();
  }
}

// Reset Game
function resetGame() {
  score = 0;
  block.y = canvas.height - 50;
  block.velocityY = 0;
  platforms = [];
  createPlatform();
  startGame();
}

// Game Loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBlock();
  drawPlatforms();
  drawScore();

  applyGravity();
  movePlatforms();
  checkPlatformCollision();
  checkGameOver();

  if (platforms.length < 3) {
    createPlatform();
  }
}

// Start Game
function startGame() {
  gameInterval = setInterval(update, 1000 / 60); // 60 FPS
}

// Handle Input
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'ArrowUp') {
    jump();
  }
});

startGame();
