//Update lives display function
function updateLivesDisplay() {
  if (window.game.livesDisplay) {
    window.game.livesDisplay.innerHTML = `Lives: ${window.game.lives}`;
  }
}

//Call updateLivesDisplay whenever lives change
function reduceLife() {
  window.game.lives -= 1;
  updateLivesDisplay();
}

// Function to create the ball
function createBall() {
  window.game.ball = Bodies.circle(400, 300, 15, { 
    restitution: 1.2, // Higher restitution value
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    inertia: Infinity,
    velocity: { x: 10, y: -10 }, // Increased initial velocity
  });
  Composite.add(window.game.world, window.game.ball);
}

// Function to limit ball speed
function limitBallSpeed() {
  const maxSpeed = 20; // Set a maximum speed for the ball
  const velocity = Matter.Body.getVelocity(window.game.ball);
  const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

  if (speed > maxSpeed) {
    const scale = maxSpeed / speed;
    Matter.Body.setVelocity(window.game.ball, {
      x: velocity.x * scale,
      y: velocity.y * scale
    });
  }
}

// Function to create the paddle
function createPaddle() {
  window.game.paddle = Bodies.rectangle(400, 550, 120, 20, { isStatic: true });
  Composite.add(window.game.world, window.game.paddle);
}

// Function to create bricks
function createBricks() {
  const rows = 5;
  const cols = 10;
  const brickWidth = 70;
  const brickHeight = 20;
  
  // This nested loop creates a grid of bricks
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const brick = Bodies.rectangle(75 + col * (brickWidth + 5), 50 + row * (brickHeight + 5), brickWidth, brickHeight, { isStatic: true });
      window.game.bricks.push(brick);
      Composite.add(window.game.world, brick);
    }
  }
}

// Start game loop ///
// Initialize game elements
createBall();
createPaddle();
createBricks();

// Function to reset the ball position
function resetBall() {
  Matter.Body.setPosition(window.game.ball, { x: 400, y: 300 });
  Matter.Body.setVelocity(window.game.ball, { x: 5, y: -5 });
}

// Collision event to handle ball and brick collisions
Matter.Events.on(window.game.engine, 'collisionStart', function(event) {
  const pairs = event.pairs;

  // Loop through all collision pairs
  pairs.forEach(pair => {
    const { bodyA, bodyB } = pair;

    // Check if ball hits paddle
    if (bodyA === window.game.ball && bodyB === window.game.paddle || bodyB === window.game.ball && bodyA === window.game.paddle) {
      const ballVelocity = Matter.Body.getVelocity(window.game.ball);
      const paddleVelocity = Matter.Body.getVelocity(window.game.paddle);

        // Reverse ball's vertical velocity
      ballVelocity.y = -Math.abs(ballVelocity.y);

      // Add a random velocity addition/subtraction (upwards)
      const randomVelocity = Math.random() * 10 - 5;
      ballVelocity.x += randomVelocity;

      // Add paddle's velocity to the ball's velocity
      ballVelocity.x += paddleVelocity.x * 0.5;

      // Prevent 90-degree bounce
      if (Math.abs(ballVelocity.y) > Math.abs(ballVelocity.x)) {
        ballVelocity.x = ballVelocity.y > 0 ? 1 : -1;
      }

      // Add upward direction to the ball
      ballVelocity.y -= 0.5; // Reduced upward force

      // Limit ball speed after applying changes
      const speed = Math.sqrt(ballVelocity.x ** 2 + ballVelocity.y ** 2);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        ballVelocity.x *= scale;
        ballVelocity.y *= scale;
    }

      Matter.Body.setVelocity(window.game.ball, ballVelocity);
  }

    // Check if ball hits bottom boundary, and, if so, reset ball and reduce life by 1
    if (bodyA === window.game.ball && bodyB === window.game.ground || bodyB === window.game.ball && bodyA === window.game.ground) {
    resetBall();
    reduceLife();
  }

    // Check if ball hits any brick
    window.game.bricks.forEach((brick, index) => {
      if (bodyA === window.game.ball && bodyB === brick || bodyB === window.game.ball && bodyA === brick) {
        // Remove brick from world and array
        Composite.remove(window.game.world, brick);
        window.game.bricks.splice(index, 1);
        // Reverse ball's vertical velocity
        Matter.Body.setVelocity(window.game.ball, { x: window.game.ball.velocity.x, y: -window.game.ball.velocity.y });

        // Slow down the ball
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
    window.game.lives = 3;
    updateLivesDisplay();
    resetBall();
  }
});



