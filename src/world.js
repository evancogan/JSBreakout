// Javascript object destructuring to get required modules from matter.js
const { Engine, Render, Runner, Bodies, Composite } = Matter;

// Create engine and world for matter.js
const engine = Engine.create();
const world = engine.world;

window.game.engine = engine;
window.game.world = world;

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

window.game.render = render;

// This starts the renderer
Render.run(render);

// Create runner - a runner is a loop that continuously calls the engine
const runner = Runner.create();
Runner.run(runner, engine);
window.game.runner = runner;

// Create ground, top boundary, and walls
const ground = Bodies.rectangle(400, 620, 800, 40, { isStatic: true });
const topBoundary = Bodies.rectangle(400, 0, 800, 40, { isStatic: true });
const leftWall = Bodies.rectangle(-20, 300, 40, 600, { isStatic: true });
const rightWall = Bodies.rectangle(820, 300, 40, 600, { isStatic: true });

window.game.ground = ground;
window.game.topBoundary = topBoundary;
window.game.leftWall = leftWall;
window.game.rightWall = rightWall;

// Composite is a collection of bodies, constraints, and other composites
Composite.add(world, [ground, topBoundary, leftWall, rightWall]);

