import Player from './Player.js'
import Ground from './Ground.js'
import CactiController from './CactiController.js'
import Score from './Score.js'

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const GAME_SPEED_START = 0.75 // 0.75 out of 1
const GAME_SPEED_INCREMENT = 0.00001 // 0.001 out of 1

const GAME_WIDTH = 800
const GAME_HEIGHT = 200
const PLAYER_WIDTH = 88 / 1.5 // 58 out of width 800
const PLAYER_HEIGHT = 94 / 1.5 // 62 out of height 200
const MAX_JUMP_HEIGHT = GAME_HEIGHT
const MIN_JUMP_HEIGHT = 150
const GROUND_WIDTH = 2400
const GROUND_HEIGHT = 24
const GROUND_AND_CACTUS_SPEED = 0.5

const CACTI_CONFIG = [
    {
        width: 48 / 1.5,
        height: 100 / 1.5,
        image: 'images/cactus_1.png'
    },
    {
        width: 98 / 1.5,
        height: 100 / 1.5,
        image: 'images/cactus_2.png'
    },
    {
        width: 68 / 1.5,
        height: 70 / 1.5,
        image: 'images/cactus_3.png'
    },
]

// Game Objects
let player = null
let ground = null
let cactiController = null
let score = null

let scaleRatio = null
let previousTime = null
let gameSpeed = GAME_SPEED_START
let gameOver = false
let hasAddedEventListenersForRestart = false
let waitingToStart = true

function createSprites() {
    // figure out width and height of the player
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio

    const groundWidthInGame = GROUND_WIDTH * scaleRatio
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio

    player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio)
    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_AND_CACTUS_SPEED, scaleRatio)

    const cactiImages = CACTI_CONFIG.map(cactus => {
        const image = new Image()
        image.src = cactus.image
        return {
            image,
            width: cactus.width * scaleRatio,
            height: cactus.height * scaleRatio
        }
    })

    cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_AND_CACTUS_SPEED)

    score = new Score(ctx, scaleRatio)
}

function setScreen() {
    scaleRatio= getScaledRatio()
    canvas.width = GAME_WIDTH * scaleRatio
    canvas.height = GAME_HEIGHT * scaleRatio
    createSprites()
}

setScreen();
window.addEventListener('resize', () => setTimeout(setScreen, 500))

if(screen.orientation) {
    screen.orientation.addEventListener('change', () => setTimeout(setScreen, 500))
}

function clearScreen() {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function updateGameSpeed(frameTimeDelta) {
    gameSpeed += GAME_SPEED_INCREMENT * frameTimeDelta
}

function reset() {
    hasAddedEventListenersForRestart = false
    gameOver = false
    waitingToStart = false
    ground.reset()
    cactiController.reset()
    score.reset()
    gameSpeed = GAME_SPEED_START
}

function showGameOver() {
    const fontSize = 70 * scaleRatio
    ctx.font = `${fontSize}px Verdana`
    ctx.fillStyle = 'grey'
    const x = canvas.width / 4.5
    const y = canvas.height / 2
    ctx.fillText("GAME OVER", x, y)
}

function showStartGameText() {
    const fontSize = 40 * scaleRatio
    ctx.font = `${fontSize}px Verdana`
    ctx.fillStyle = 'grey'
    const x = canvas.width / 45
    const y = canvas.height / 2
    ctx.fillText("Tap the screen or press space to start", x, y)
}

function setUpGameReset() {
    if(!hasAddedEventListenersForRestart) {
        hasAddedEventListenersForRestart= true

        setTimeout(() => {
            window.addEventListener('keyup', reset, { once: true}) 
            window.addEventListener('touchstart', reset, { once: true})
        }, 1000)
    }
}

function gameLoop(currentTime) {
    if(previousTime === null) {
        previousTime = currentTime
        requestAnimationFrame(gameLoop)
        return
    }

    const frameTimeDelta = currentTime - previousTime
    previousTime = currentTime

    clearScreen()

    if(!gameOver && !waitingToStart) {
        // Update game objects
        ground.update(gameSpeed, frameTimeDelta)
        cactiController.update(gameSpeed, frameTimeDelta)
        player.update(gameSpeed, frameTimeDelta)
        score.update(frameTimeDelta)
        updateGameSpeed(frameTimeDelta)
    }
   
    if(!gameOver && cactiController.collideWith(player)) {
        gameOver = true
        setUpGameReset()
        score.setHighScore()
    }

    // Draw game objects
    player.draw()
    cactiController.draw()
    ground.draw()
    score.draw()

    if(gameOver) {
        showGameOver()
    }

    if(waitingToStart) {
        showStartGameText()
    }


    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)

function getScaledRatio() {
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight)
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth)

    // Is the window is wider than the game width?
    if(screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH
    }
    else screenHeight / GAME_HEIGHT
}

window.addEventListener('keyup', reset, { once: true}) 
window.addEventListener('touchstart', reset, { once: true})