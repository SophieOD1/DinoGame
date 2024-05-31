console.log('Hello, world!');
import Player from './Player.js';
import Ground from './Ground.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GAME_SPEED_START = 0.75; // 0.75 out of 1
const GAME_SPEED_INCREMENT = 0.001; // 0.001 out of 1

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5; // 58 out of width 800
const PLAYER_HEIGHT = 94 / 1.5; // 62 out of height 200
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.5;

// Game Objects
let player = null;
let ground = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;

function createSprites() {
    // figure out width and height of the player
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

    player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);
    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_AND_CACTUS_SPEED, scaleRatio)
}

function setScreen() {
    scaleRatio= getScaledRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}

setScreen();
window.addEventListener('resize', () => setTimeout(setScreen, 500));

if(screen.orientation) {
    screen.orientation.addEventListener('change', () => setTimeout(setScreen, 500));
}

function clearScreen() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
    if(previousTime === null) {
        previousTime = currentTime
        requestAnimationFrame(gameLoop)
        return
    }

    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime

    clearScreen()

    // Update game objects
    ground.update(gameSpeed, frameTimeDelta)

    // Draw game objects
    player.draw();
    ground.draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

function getScaledRatio() {
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

    // Is the window is wider than the game width?
    if(screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    }
    else screenHeight / GAME_HEIGHT;
}