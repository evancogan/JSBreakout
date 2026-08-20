// Global game state
window.game = window.game || {};
window.game.engine = null;
window.game.world = null;
window.game.render = null;
window.game.runner = null;
window.game.ground = null;
window.game.topBoundary = null;
window.game.leftWall = null;
window.game.rightWall = null;
window.game.ball = null;
window.game.paddle = null;
window.game.bricks = [];
window.game.lives = 3;
window.game.livesDisplay = null;
window.game.paddleControlEnabled = false;
window.game.gameStarted = false;

// Constants
const BALL_RESTITUTION = 1.2;
const BALL_INITIAL_VELOCITY = { x: 10, y: -10 };
const BALL_MAX_SPEED = 20;
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 20;
const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 20;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_OFFSET_X = 75;
const BRICK_OFFSET_Y = 50;
const BALL_RESET_POSITION = { x: 400, y: 300 };
const BALL_RESET_VELOCITY = { x: 5, y: -5 };
const GAME_OVER_LIVES = 3;