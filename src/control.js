// Start the game on the first click and enable paddle control.
document.addEventListener('click', function() {
  if (window.game.gameStarted) return;

  window.game.gameStarted = true;
  window.game.paddleControlEnabled = true;

  Matter.Body.setVelocity(window.game.ball, { x: 5, y: -5 });
}, { once: true });

// Event listener for paddle movement
document.addEventListener('mousemove', function(event) {
  if (!window.game.paddleControlEnabled) return;
  const mouseX = event.clientX;
  Matter.Body.setPosition(window.game.paddle, { x: mouseX, y: window.game.paddle.position.y });
});
