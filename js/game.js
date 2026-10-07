/** @type {HTMLCanvasElement} Canvas on which the game is rendered. */
let canvas;

/** @type {World} The current game world. */
let world;


/**
 * Initializes the Sharkie game.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);
}


init();