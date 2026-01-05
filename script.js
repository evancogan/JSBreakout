// Javascript object destructuring to get required modules from matter.js
const { Engine, Render, Runner, Bodies, Composite } = Matter;

// Create engine and world for matter.js
const engine = Engine.create();
const world = engine.world;

//Disable gravity in the y direction
world.gravity.y = 0;


// Create renderer, the matter.render renderer
const render = Render.create({
  element: document.body, // attaches canvas to <body>
  engine: engine, // the engine to be rendered
  options: {
    width: 800,
    height: 600,
    wireframes: false, // set to true for outlines only
    background: '#fafafa' // white background color
  }
});

// This starts the renderer
Render.run(render);

// Create runner - a runner is a loop that continuously calls the engine
const runner = Runner.create();
Runner.run(runner, engine);

// Create ground, top boundary, and walls
const ground = Bodies.rectangle(400, 620, 800, 40, { isStatic: true });
const topBoundary = Bodies.rectangle(400, 0, 800, 40, { isStatic: true });
const leftWall = Bodies.rectangle(-20, 300, 40, 600, { isStatic: true });
const rightWall = Bodies.rectangle(820, 300, 40, 600, { isStatic: true });


// Composite is a collection of bodies, constraints, and other composites
Composite.add(world, [ground, topBoundary, leftWall, rightWall]);
//Set initial life count
let lives = 3;

//Display lives on the screen
const livesDisplay = document.createElement('div');
livesDisplay.style.position = 'absolute';
livesDisplay.style.top = '10px';
livesDisplay.style.left = '10px';
livesDisplay.style.fontSize = '24px';
livesDisplay.style.fontFamily = 'Arial, sans-serif';
livesDisplay.innerHTML = `Lives: ${lives}`;
document.body.appendChild(livesDisplay);

//Update lives display function
function updateLivesDisplay() {
  livesDisplay.innerHTML = `Lives: ${lives}`;
}

//Call updateLivesDisplay whenever lives change
function reduceLife() {
  lives -= 1;
  updateLivesDisplay();
}

//Assign the ball, paddle, and bricks array
let ball;
let paddle;
let bricks = [];

// Function to create the ball
function createBall() {
  ball = Bodies.circle(400, 300, 15, { 
    restitution: 1,      // Perfect bounce
    friction: 0,         // No friction against surfaces
    frictionAir: 0,      // No air resistance (keeps speed constant)
    frictionStatic: 0,
    inertia: Infinity    // Prevents the ball from spinning
  });
  Composite.add(world, ball);
  
  // Give the ball an initial push
  Matter.Body.setVelocity(ball, { x: 5, y: -5 });
}

// Function to create the paddle
function createPaddle() {
  paddle = Bodies.rectangle(400, 550, 120, 20, { isStatic: true });
  Composite.add(world, paddle);
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
      bricks.push(brick);
      Composite.add(world, brick);
    }
  }
}


// Start game loop //

// Initialize game elements
createBall();
createPaddle();
createBricks();

// Event listener for paddle movement
document.addEventListener('mousemove', function(event) {
  const mouseX = event.clientX;
  Matter.Body.setPosition(paddle, { x: mouseX, y: paddle.position.y });
});

// Function to reset the ball position
function resetBall() {
  Matter.Body.setPosition(ball, { x: 400, y: 300 });
  Matter.Body.setVelocity(ball, { x: 5, y: -5 });
}

// Collision event to handle ball and brick collisions
Matter.Events.on(engine, 'collisionStart', function(event) {
  const pairs = event.pairs;

  // Loop through all collision pairs
  pairs.forEach(pair => {
    const { bodyA, bodyB } = pair;
    
    // Check if ball hits paddle
    if (bodyA === ball && bodyB === paddle || bodyB === ball && bodyA === paddle) {
      // Reverse ball's vertical velocity
      Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: -Math.abs(ball.velocity.y) });
    }
    
    // Check if ball hits bottom boundary, and, if so, reset ball and reduce life by 1
    if (bodyA === ball && bodyB === ground || bodyB === ball && bodyA === ground) {
      resetBall();
      reduceLife();
    }
    // Check if ball hits any brick
    bricks.forEach((brick, index) => {
      if (bodyA === ball && bodyB === brick || bodyB === ball && bodyA === brick) {
        // Remove brick from world and array
        Composite.remove(world, brick);
        bricks.splice(index, 1);
        // Reverse ball's vertical velocity
        Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: -ball.velocity.y });
      }
    });
  });
});

// Game loop to check for ball out of bounds
Matter.Events.on(engine, 'afterUpdate', function() {
  if (ball.position.y > 600) {
    resetBall();
    reduceLife();
  }
});

// Check if lives reach -1, if so, end the game
Matter.Events.on(engine, 'afterUpdate', function() {
  if (lives < 1) {
    alert('Game Over!');
    // Reset lives and update display
    lives = 3;
    updateLivesDisplay();
    resetBall();
  }
});


/* To do:
- Add sound effects for collisions
- Add scoring system
- Improve graphics and add colors to bricks
- Add levels with increasing difficulty
- Implement a start screen and game over screen
- Add power-ups (e.g., larger paddle, multi-ball)
- Optimize for mobile devices
- Add pause functionality
- Design and add background music
- Remove the bar above the game that is blocking the text at the top left corner
- Implement touch controls for mobile devices
- Add animations for brick destruction
- Create a high score leaderboard
- Add different brick types (e.g., unbreakable, multi-hit)
- Possibly import p5.js for enhanced graphics and effects
- Possibly import a sound library for better audio management
- Possibly import phaser for input handling?

*/