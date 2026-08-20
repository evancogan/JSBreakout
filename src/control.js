// keyboard control state starts false
let keyboardActive = false;


// Start the game on the first click and enable paddle control.
document.addEventListener('click', function () {
  if (window.game.gameStarted) return;

  window.game.gameStarted = true;
  window.game.paddleControlEnabled = true;

  // Launch the ball
  Matter.Body.setVelocity(window.game.ball, { x: 5, y: -5 });
}, { once: true });


// ------------------------------
// Mouse Paddle Movement
// ------------------------------
document.addEventListener('mousemove', function (event) {
  if (!window.game.paddleControlEnabled) return;

  // Prevent mouse from overriding keyboard movement
  if (keyboardActive) return;

  const mouseX = event.clientX;

  Matter.Body.setPosition(window.game.paddle, {
    x: mouseX,
    y: window.game.paddle.position.y
  });
});


// ------------------------------
// Keyboard Paddle Movement
// ------------------------------
document.addEventListener('keydown', function (event) {
  if (!window.game.paddleControlEnabled) return;

  const velocityFactor = 2;
  let velocity = { x: 0, y: 0 };

  switch (event.key) {
    case 'ArrowLeft':
      velocity.x = -10 * velocityFactor;
      keyboardActive = true;
      break;

    case 'ArrowRight':
      velocity.x = 10 * velocityFactor;
      keyboardActive = true;
      break;

    default:
      return; // ignore other keys
  }

  Matter.Body.setVelocity(window.game.paddle, velocity);
});


// Stop paddle when arrow keys are released
document.addEventListener('keyup', function (event) {
  if (!window.game.paddleControlEnabled) return;

  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    Matter.Body.setVelocity(window.game.paddle, { x: 0, y: 0 });
    keyboardActive = false; // allow mouse control again
  }
});
