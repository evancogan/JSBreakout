// Constants
const BALL_RESTITUTION = 1.2;
const BALL_INITIAL_VELOCITY = { x: 10, y: -10 };
const BALL_MAX_SPEED = 20;
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 20;
const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 20;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_OFFSET_X = 75;
const BRICK_OFFSET_Y = 50;
const BALL_RESET_POSITION = { x: 400, y: 300 };
const BALL_RESET_VELOCITY = { x: 5, y: -5 };
const GAME_OVER_LIVES = 3;
// Update lives display function
function updateLivesDisplay() {
  if (window.game.livesDisplay) {
    window.game.livesDisplay.innerHTML = `Lives: ${window.game.lives}`;
  }
}

// Call updateLivesDisplay whenever lives change
function reduceLife() {
  window.game.lives -= 1;
  updateLivesDisplay();
}

// Function to create the ball
function createBall() {
  window.game.ball = Bodies.circle(400, 300, 15, { 
    restitution: BALL_RESTITUTION,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    inertia: Infinity,
    velocity: BALL_INITIAL_VELOCITY,
  });
  Composite.add(window.game.world, window.game.ball);
}

// Function to limit ball speed
function limitBallSpeed() {
  const speed = Math.sqrt(window.game.ball.velocity.x ** 2 + window.game.ball.velocity.y ** 2);

  if (speed > BALL_MAX_SPEED) {
    const scale = BALL_MAX_SPEED / speed;
    Matter.Body.setVelocity(window.game.ball, {
      x: window.game.ball.velocity.x * scale,
      y: window.game.ball.velocity.y * scale
    });
  }
}

// Function to create the paddle
function createPaddle() {
  window.game.paddle = Bodies.rectangle(400, 550, PADDLE_WIDTH, PADDLE_HEIGHT, {
    isStatic: false,
    inertia: Infinity,
    frictionAir: 0,
    friction: 0,
    frictionStatic: 0
  });

  Composite.add(window.game.world, window.game.paddle);
}

// Function to create bricks
function createBricks() {
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      const brick = Bodies.rectangle(BRICK_OFFSET_X + col * (BRICK_WIDTH + 5), BRICK_OFFSET_Y + row * (BRICK_HEIGHT + 5), BRICK_WIDTH, BRICK_HEIGHT, { isStatic: true });
      window.game.bricks.push(brick);
      Composite.add(window.game.world, brick);
    }
  }
}

// Start game loop
// Initialize game elements
createBall();
createPaddle();
createBricks();

// Function to reset the ball position
function resetBall() {
  Matter.Body.setPosition(window.game.ball, BALL_RESET_POSITION);
  Matter.Body.setVelocity(window.game.ball, BALL_RESET_VELOCITY);
}

// Collision event to handle ball and brick collisions
Matter.Events.on(window.game.engine, 'collisionStart', function(event) {
  const pairs = event.pairs;

  pairs.forEach(pair => {
    const { bodyA, bodyB } = pair;

    if (bodyA === window.game.ball && bodyB === window.game.paddle || bodyB === window.game.ball && bodyA === window.game.paddle) {
      const ballVelocity = Matter.Body.getVelocity(window.game.ball);
      const paddleVelocity = Matter.Body.getVelocity(window.game.paddle);

      ballVelocity.y = -Math.abs(ballVelocity.y);
      const randomVelocity = Math.random() * 10 - 5;
      ballVelocity.x += randomVelocity;
      ballVelocity.x += paddleVelocity.x * 0.5;

      if (Math.abs(ballVelocity.y) > Math.abs(ballVelocity.x)) {
        ballVelocity.x = ballVelocity.y > 0 ? 1 : -1;
      }

      ballVelocity.y -= 0.5;
      const speed = Math.sqrt(ballVelocity.x ** 2 + ballVelocity.y ** 2);
      if (speed > BALL_MAX_SPEED) {
        const scale = BALL_MAX_SPEED / speed;
        ballVelocity.x *= scale;
        ballVelocity.y *= scale;
    }

      Matter.Body.setVelocity(window.game.ball, ballVelocity);
  }

    if (bodyA === window.game.ball && bodyB === window.game.ground || bodyB === window.game.ball && bodyA === window.game.ground) {
    resetBall();
    reduceLife();
  }

    window.game.bricks.forEach((brick, index) => {
      if (bodyA === window.game.ball && bodyB === brick || bodyB === window.game.ball && bodyA === brick) {
        Composite.remove(window.game.world, brick);
        window.game.bricks.splice(index, 1);
        Matter.Body.setVelocity(window.game.ball, { x: window.game.ball.velocity.x, y: -window.game.ball.velocity.y });

        Matter.Body.setVelocity(window.game.ball, {
          x: window.game.ball.velocity.x * 0.9,
          y: window.game.ball.velocity.y * 0.9
        });
      }
    });
  });
});

// Game loop to check for ball out of bounds
Matter.Events.on(window.game.engine, 'afterUpdate', function() {
  limitBallSpeed();
  if (window.game.ball.position.y > 600) {
    resetBall();
    reduceLife();
  }

  if (window.game.lives < 1) {
    alert('Game Over!');
    window.game.lives = GAME_OVER_LIVES;
    updateLivesDisplay();
    resetBall();
  }
});

