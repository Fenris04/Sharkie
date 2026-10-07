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

    addRestartEvent();
    startGame();
}


/**
 * Creates a new game world.
 *
 * @returns {void}
 */
function startGame() {
    hideGameOverScreen();
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
 * Adds the click event to the restart button.
 *
 * @returns {void}
 */
function addRestartEvent() {
    const restartButton = document.getElementById('restart-button');

    restartButton.addEventListener('click', restartGame);
}


/**
 * Hides the game-over screen.
 *
 * @returns {void}
 */
function hideGameOverScreen() {
    const gameOverScreen = document.getElementById(
        'game-over-screen'
    );

    gameOverScreen.classList.remove('visible');
}


init();