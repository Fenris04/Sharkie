/**
 * Represents the game world.
 * Manages the character, background and rendering of game objects.
 */
class World {

    /** @type {Character} The playable Sharkie character. */
    character;

    /** @type {BackgroundObject} Background of the game world. */
    background = new BackgroundObject(
        'assets/3. Background/Light/full.png',
        0
    );

    /** @type {HTMLCanvasElement} Canvas used to display the game. */
    canvas;

    /** @type {CanvasRenderingContext2D} Drawing context of the canvas. */
    ctx;


    /**
     * Creates the game world.
     *
     * @param {HTMLCanvasElement} canvas - Canvas used to display the game.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.character = new Character(keyboard);

        this.draw();
    }


    /**
     * Continuously redraws the game world.
     *
     * @returns {void}
     */
    draw() {
        this.clearCanvas();
        this.background.draw(this.ctx);

        this.character.move();
        this.character.draw(this.ctx);

        requestAnimationFrame(() => this.draw());
    }


    /**
     * Clears the canvas before drawing the next frame.
     *
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }
}