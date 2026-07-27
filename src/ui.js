//Display lives on the screen
const livesDisplay = document.createElement('div');
livesDisplay.style.position = 'absolute';
livesDisplay.style.top = '10px';
livesDisplay.style.left = '10px';
livesDisplay.style.fontSize = '24px';
livesDisplay.style.fontFamily = 'Arial, sans-serif';
livesDisplay.innerHTML = `Lives: ${window.game.lives}`;
document.body.appendChild(livesDisplay);

window.game.livesDisplay = livesDisplay;