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
    * Draws the object onto the canvas.
    *
    * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
    * @returns {void}
    */
    draw(ctx) {
      if (this.otherDirection) {
          this.drawFlipped(ctx);
     } else {
         this.drawNormal(ctx);
     }
    } 

    /**
    * Draws the object in its normal direction.
    *
    * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
    * @returns {void}
    */
    drawNormal(ctx) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }


    /**
    * Draws the object horizontally flipped.
    *
    * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
    * @returns {void}
    */
    drawFlipped(ctx) {
      ctx.save();
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
      ctx.drawImage(this.img, 0, 0, this.width, this.height);
      ctx.restore();
    }


    /**
    * Loads an image from the given path.
    *
    * @param {string} imagePath - Path to the image file.
    * @returns {void}
    */
    loadImage(imagePath) {
      this.img = new Image();
      this.img.src = imagePath;
    }
}