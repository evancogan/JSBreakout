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
    restitution: 1,      // Perfect bounce
    friction: 0,         // No friction against surfaces
    frictionAir: 0,      // No air resistance
    frictionStatic: 0,
    inertia: Infinity    // Prevents the ball from spinning
  });
  Composite.add(window.game.world, window.game.ball);
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


// Start game loop //

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
      // Reverse ball's vertical velocity
      Matter.Body.setVelocity(window.game.ball, { x: window.game.ball.velocity.x, y: -Math.abs(window.game.ball.velocity.y) });
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
      }
    });
  });
});

// Game loop to check for ball out of bounds
Matter.Events.on(window.game.engine, 'afterUpdate', function() {
  if (window.game.ball.position.y > 600) {
    resetBall();
    reduceLife();
  }
});

// Check if lives reach -1, if so, end the game
Matter.Events.on(window.game.engine, 'afterUpdate', function() {
  if (window.game.lives < 1) {
    alert('Game Over!');
    // Reset lives and update display
    window.game.lives = 3;
    updateLivesDisplay();
    resetBall();
  }
});
