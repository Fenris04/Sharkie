/** @type {HTMLCanvasElement} Canvas on which the game is rendered. */
let canvas;

/** @type {World|null} The currently active game world. */
let world = null;

/** @type {AudioManager} Manages music and sound effects. */
const audioManager = new AudioManager();

/**
 * Initializes the Sharkie game without starting the world.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    addStartEvent();
    addRestartEvents();
    addMenuEvent();
    addPauseEvents();
    addEscapeEvent();
    addInitialMenuMusicEvent();
    document.getElementById('sound-button')
    .addEventListener('click', toggleGameSound);
}

/**
 * Creates a new game world and starts gameplay music.
 *
 * @returns {void}
 */
function startGame() {
    if (world) return;
    hideEndScreens();
    hidePauseScreen();
    hideStartScreen();
    showMenuButton();
    world = new World(canvas);
    audioManager.stopEffects();
    audioManager.playMusic('game');
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
 * Stops the current game and returns to the main menu.
 *
 * @returns {void}
 */
function returnToMenu() {
    stopCurrentGame();
    hidePauseScreen();
    hideEndScreens();
    hideMenuButton();
    showStartScreen();
    audioManager.playMusic('menu');
}

/**
 * Opens the pause menu without destroying the current world.
 *
 * @returns {void}
 */
function openPauseMenu() {
    if (!world || world.paused || world.gameOver) return;
    if (world.gameState === 'won') return;

    resetKeyboardControls();
    releaseTouchControls();
    world.pause();
    audioManager.pauseAll();
    showPauseScreen();
    document.getElementById('resume-button').focus();
}

/**
 * Closes the pause menu and continues the game.
 *
 * @returns {void}
 */
function closePauseMenu() {
    if (!world || !world.paused) return;

    resetKeyboardControls();
    releaseTouchControls();
    hidePauseScreen();
    world.resume();
    audioManager.resumeAll();
    document.getElementById('menu-button').focus();
}

/**
 * Stops all intervals belonging to the current game.
 *
 * @returns {void}
 */
function stopCurrentGame() {
    resetKeyboardControls();
    releaseTouchControls();
    audioManager.stopEffects();
    audioManager.stopMusic();
    if (!world) return;

    world.stop();
    world = null;
}

/**
 * Opens the existing instructions dialog from the pause menu.
 *
 * @returns {void}
 */
function openPauseControls() {
    const dialog = document.getElementById('instructions-dialog');
    if (!world || !world.paused || dialog.open) return;
    dialog.showModal();
}

/**
 * Toggles the pause menu using the Escape key.
 *
 * @param {KeyboardEvent} event - Keyboard event.
 * @returns {void}
 */
function handleEscape(event) {
    if (event.key !== 'Escape' || event.repeat) return;

    const dialog = document.getElementById('instructions-dialog');
    if (dialog.open || !world) return;

    event.preventDefault();

    if (world.paused) {
        closePauseMenu();
    } else {
        openPauseMenu();
    }
}

/**
 * Connects the start button to the game.
 *
 * @returns {void}
 */
function addStartEvent() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', startGame);
}

/**
 * Connects the restart buttons to the game.
 *
 * @returns {void}
 */
function addRestartEvents() {
    document.getElementById('restart-button')
        .addEventListener('click', restartGame);

    document.getElementById('win-restart-button')
        .addEventListener('click', restartGame);

    document.getElementById('win-menu-button')
        .addEventListener('click', returnToMenu);

    document.getElementById('game-over-menu-button')
        .addEventListener('click', returnToMenu);
}

/**
 * Connects the in-game menu button to the pause menu.
 *
 * @returns {void}
 */
function addMenuEvent() {
    const menuButton = document.getElementById('menu-button');
    menuButton.addEventListener('click', openPauseMenu);
}

/**
 * Connects all pause menu buttons.
 *
 * @returns {void}
 */
function addPauseEvents() {
    document.getElementById('resume-button')
        .addEventListener('click', closePauseMenu);
    document.getElementById('pause-controls-button')
        .addEventListener('click', openPauseControls);
    document.getElementById('pause-main-menu-button')
        .addEventListener('click', returnToMenu);
}

/**
 * Connects the Escape key to the pause menu.
 *
 * @returns {void}
 */
function addEscapeEvent() {
    document.addEventListener('keydown', handleEscape);
}

/**
 * Shows the pause menu and updates accessibility attributes.
 *
 * @returns {void}
 */
function showPauseScreen() {
    const screen = document.getElementById('pause-screen');
    screen.classList.add('visible');
    screen.setAttribute('aria-hidden', 'false');
    document.getElementById('menu-button')
        .setAttribute('aria-expanded', 'true');
}

/**
 * Hides the pause menu and updates accessibility attributes.
 *
 * @returns {void}
 */
function hidePauseScreen() {
    const screen = document.getElementById('pause-screen');
    screen.classList.remove('visible');
    screen.setAttribute('aria-hidden', 'true');
    document.getElementById('menu-button')
        .setAttribute('aria-expanded', 'false');
}

/**
 * Shows the main menu.
 *
 * @returns {void}
 */
function showStartScreen() {
    document.getElementById('start-screen').classList.add('visible');
}

/**
 * Hides the main menu.
 *
 * @returns {void}
 */
function hideStartScreen() {
    document.getElementById('start-screen').classList.remove('visible');
}

/**
 * Shows the menu button while the game is running.
 *
 * @returns {void}
 */
function showMenuButton() {
    document.getElementById('menu-button').classList.add('visible');
}

/**
 * Hides the menu button on the main menu.
 *
 * @returns {void}
 */
function hideMenuButton() {
    document.getElementById('menu-button').classList.remove('visible');
}

/**
 * Hides the game-over and victory screens.
 *
 * @returns {void}
 */
function hideEndScreens() {
    document.getElementById('game-over-screen').classList.remove('visible');
    document.getElementById('you-win-screen').classList.remove('visible');
}

/**
 * Starts menu music after the first user interaction.
 *
 * @returns {void}
 */
function addInitialMenuMusicEvent() {
    document.addEventListener('pointerdown', startInitialMenuMusic, {
        once: true
    });
}

/**
 * Starts menu music only while the main menu is visible.
 *
 * @returns {void}
 */
function startInitialMenuMusic() {
    if (world) return;
    audioManager.playMusic('menu');
}

/**
 * Toggles game audio and updates the sound button.
 *
 * @returns {void}
 */
function toggleGameSound() {
    audioManager.toggleMute();

    const button = document.getElementById('sound-button');
    const muted = audioManager.muted;

    button.textContent = muted ? '🔇' : '🔊';
    button.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
    button.setAttribute('aria-pressed', String(muted));
    button.title = muted ? 'Unmute sound' : 'Mute sound';
}

init();