
// Event listener to enable paddle control on first click
document.addEventListener('click', function() {
  window.game.paddleControlEnabled = true;
}, { once: true });

// Event listener for paddle movement
document.addEventListener('mousemove', function(event) {
  if (!window.game.paddleControlEnabled) return;
  const mouseX = event.clientX;
  Matter.Body.setPosition(window.game.paddle, { x: mouseX, y: window.game.paddle.position.y });
});
