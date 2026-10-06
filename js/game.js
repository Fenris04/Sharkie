/** @type {HTMLCanvasElement} The canvas used to display the game. */
let canvas;

/** @type {CanvasRenderingContext2D} The drawing context of the canvas. */
let ctx;


/**
 * Initializes the game and prepares the canvas.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
}