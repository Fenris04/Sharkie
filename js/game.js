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
 * Continuously updates and redraws the game.
 *
 * @returns {void}
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    moveCharacter();
    character.draw(ctx);

    requestAnimationFrame(draw);
}


init();

/**
 * Moves Sharkie according to the currently pressed keys.
 *
 * @returns {void}
 */
function moveCharacter() {
    if (keyboard.RIGHT && character.canMoveRight()) character.moveRight();
    if (keyboard.LEFT && character.canMoveLeft()) character.moveLeft();
    if (keyboard.UP && character.canMoveUp()) character.moveUp();
    if (keyboard.DOWN && character.canMoveDown()) character.moveDown();
}