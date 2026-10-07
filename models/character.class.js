/**
 * Represents the playable character Sharkie.
 * Handles Sharkie's position, size and animations.
 */
class Character {

    /** @type {number} Horizontal position of Sharkie on the canvas. */
    x = 100;

    /** @type {number} Vertical position of Sharkie on the canvas. */
    y = 100;

    /** @type {number} Width of Sharkie in pixels. */
    width = 300;

    /** @type {number} Height of Sharkie in pixels. */
    height = 250;

    /** @type {HTMLImageElement} Currently displayed image of Sharkie. */
    img = new Image();

    /** @type {number} Index used to select the current animation frame. */
    currentImage = 0;

    /** @type {HTMLImageElement[]} Preloaded images for the idle animation. */
    idleImages = [];


    /**
     * Creates Sharkie and prepares the idle animation.
     */
    constructor() {
        this.loadIdleImages();
        this.animate();
    }


    /**
     * Loads all images required for Sharkie's idle animation.
     *
     * @returns {void}
     */
    loadIdleImages() {
        for (let i = 1; i <= 18; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/1.IDLE/${i}.png`;
            this.idleImages.push(image);
        }
    }


    /**
     * Starts Sharkie's idle animation.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playIdleAnimation();
        }, 150);
    }


    /**
     * Selects the next image of the idle animation.
     *
     * @returns {void}
     */
    playIdleAnimation() {
        const index = this.currentImage % this.idleImages.length;
        this.img = this.idleImages[index];
        this.currentImage++;
    }


    /**
     * Draws Sharkie onto the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}