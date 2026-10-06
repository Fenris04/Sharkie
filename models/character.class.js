/**
 * Represents the playable character Sharkie.
 * Handles the position, size and rendering of the character.
 */
class Character {

    /** @type {number} Horizontal position on the canvas. */
    x = 100;

    /** @type {number} Vertical position on the canvas. */
    y = 100;

    /** @type {number} Width of the character in pixels. */
    width = 300;

    /** @type {number} Height of the character in pixels. */
    height = 250;

    /** @type {HTMLImageElement} Current image of the character. */
    img = new Image();


    /**
     * Creates a new Sharkie character and loads its initial image.
     */
    constructor() {
        this.img.src = 'assets/...';
    }


    /**
     * Draws Sharkie onto the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - The 2D drawing context of the canvas.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}