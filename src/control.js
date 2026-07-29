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

  const now = performance.now();
  const mouseX = event.clientX;

  if (window.game.lastPaddleMoveTime !== undefined && window.game.lastPaddleX !== undefined) {
    const deltaX = mouseX - window.game.lastPaddleX;
    const deltaTime = now - window.game.lastPaddleMoveTime;

    if (deltaTime > 0) {
      const deltaPerTick = deltaX / (deltaTime / (1000 / 60));
      const maxPaddleVelocity = 20;
      window.game.paddleVelocityX = Math.max(-maxPaddleVelocity, Math.min(maxPaddleVelocity, deltaPerTick));
    }
  }

  window.game.lastPaddleX = mouseX;
  window.game.lastPaddleMoveTime = now;
  Matter.Body.setPosition(window.game.paddle, { x: mouseX, y: window.game.paddle.position.y });
});

Matter.Events.on(window.game.engine, 'beforeUpdate', function() {
  if (window.game.paddleVelocityX === undefined) {
    window.game.paddleVelocityX = 0;
    return;
  }

  window.game.paddleVelocityX *= 0.85;

  if (Math.abs(window.game.paddleVelocityX) < 0.05) {
    window.game.paddleVelocityX = 0;
  }
});
