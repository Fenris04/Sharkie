
/**
 * Represents an animated collectible poison bottle.
 */
class PoisonBottle extends MovableObject {

    /** @type {number} Bottle width. */
    width = 55;

    /** @type {number} Bottle height. */
    height = 65;

    /** @type {number} Current animation frame. */
    currentImage = 0;

    /** @type {HTMLImageElement[]} Bottle animation frames. */
    bottleImages = [];

    /** @type {boolean} Whether the bottle was collected. */
    collected = false;

    /** @type {number|null} Animation interval identifier. */
    animationInterval = null;

    /**
     * Creates a poison bottle at a world position.
     *
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(x, y) {
        super();

        this.x = x;
        this.y = y;

        this.loadBottleImages();
        this.animate();
    }

    /**
     * Loads all eight poison bottle animation frames.
     *
     * @returns {void}
     */
    loadBottleImages() {
        for (let i = 1; i <= 8; i++) {
            const image = new Image();

            image.src = `assets/4. Marcadores/Posión/Animada/${i}.png`;
            this.bottleImages.push(image);
        }

        this.img = this.bottleImages[0];
    }

    /**
     * Starts the bottle animation.
     *
     * @returns {void}
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.updateAnimation();
        }, 150);
    }

    /**
     * Displays the next poison bottle animation frame.
     *
     * @returns {void}
     */
    updateAnimation() {
        const index = this.currentImage % this.bottleImages.length;

        this.img = this.bottleImages[index];
        this.currentImage++;
    }

    /**
     * Marks the bottle as collected.
     *
     * @returns {void}
     */
    collect() {
        this.collected = true;
        this.stopIntervals();
    }

    /**
     * Stops the bottle animation interval.
     *
     * @returns {void}
     */
    stopIntervals() {
        clearInterval(this.animationInterval);
    }
}
