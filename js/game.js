/** @type {HTMLCanvasElement} Canvas on which the game is rendered. */
let canvas;

/** @type {CanvasRenderingContext2D} Drawing context of the canvas. */
let ctx;

/** @type {Character} Playable Sharkie character. */
let character;


/**
 * Initializes the game.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    character = new Character();

    draw();
}


/**
 * Continuously redraws the game on the canvas.
 *
 * @returns {void}
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character.draw(ctx);

    requestAnimationFrame(draw);
}


init();