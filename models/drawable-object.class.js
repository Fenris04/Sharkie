/**
 * Represents a game object that can be drawn onto the canvas.
 */
class DrawableObject {

    /** @type {HTMLImageElement} Currently displayed image. */
    img = new Image();

    /** @type {number} Horizontal position. */
    x = 0;

    /** @type {number} Vertical position. */
    y = 0;

    /** @type {number} Width of the object. */
    width = 100;

    /** @type {number} Height of the object. */
    height = 100;


    /**
     * Draws the current image onto the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}