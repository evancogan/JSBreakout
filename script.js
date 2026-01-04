// Javascript object destructuring to get required modules from matter.js
const { Engine, Render, Runner, Bodies, Composite } = Matter;

// Create engine and world for matter.js
const engine = Engine.create();
const world = engine.world;

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

// Add bodies- favtory function to create shapes, like rectangles and circles- but here we create a box and a ground for testing
const box = Bodies.rectangle(400, 200, 80, 80);
const ground = Bodies.rectangle(400, 580, 810, 40, { isStatic: true });

// Composite is a collection of bodies, constraints, and other composites
Composite.add(world, [box, ground]);
