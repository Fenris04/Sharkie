/** @type {HTMLCanvasElement} Canvas on which the game is rendered. */
let canvas;

/** @type {CanvasRenderingContext2D} Drawing context of the canvas. */
let ctx;

/** @type {Character} Playable Sharkie character. */
let character;

/** @type {BackgroundObject} Background of the game world. */
let background;


/**
 * Initializes the game.
 *
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    background = new BackgroundObject(
    'assets/3. Background/Light/full.png',
    0
    );

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

    background.draw(ctx);
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