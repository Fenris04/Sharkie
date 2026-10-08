/** @type {HTMLCanvasElement} Canvas on which the game is rendered. */
let canvas;

/** @type {World|null} The currently active game world. */
let world = null;


/**
 * Initializes the Sharkie game.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');

    addRestartEvents();
    startGame();
}


/**
 * Creates a new game world and hides all end screens.
 *
 * @returns {void}
 */
function startGame() {
    hideEndScreens();
    world = new World(canvas);
}


/**
 * Restarts the game without reloading the browser page.
 *
 * @returns {void}
 */
function restartGame() {
    stopCurrentGame();
    startGame();
}


/**
 * Stops all intervals belonging to the current game.
 *
 * @returns {void}
 */
function stopCurrentGame() {
    if (!world) {
        return;
    }

    world.stop();
}


/**
 * Adds click events to both restart buttons.
 *
 * @returns {void}
 */
function addRestartEvents() {
    const restartButton = document.getElementById('restart-button');
    const winRestartButton = document.getElementById('win-restart-button');

    restartButton.addEventListener('click', restartGame);
    winRestartButton.addEventListener('click', restartGame);
}


/**
 * Hides both the game-over and victory screens.
 *
 * @returns {void}
 */
function hideEndScreens() {
    const gameOverScreen = document.getElementById('game-over-screen');
    const youWinScreen = document.getElementById('you-win-screen');

    gameOverScreen.classList.remove('visible');
    youWinScreen.classList.remove('visible');
}


init();