/**
 * Represents an animated collectible coin.
 */
class Coin extends MovableObject {
    /** @type {number} Coin width. */
    width = 50;

    /** @type {number} Coin height. */
    height = 50;

    /** @type {number} Current animation frame. */
    currentImage = 0;

    /** @type {HTMLImageElement[]} Coin animation frames. */
    coinImages = [];

    /** @type {boolean} Whether the coin was collected. */
    collected = false;

    /** @type {number|null} Animation interval identifier. */
    animationInterval = null;

    /**
     * Creates an animated coin at a world position.
     *
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     */
    constructor(x, y) {
        super();

        this.x = x;
        this.y = y;

        this.loadCoinImages();
        this.animate();
    }

    /**
     * Loads all five coin animation frames.
     *
     * @returns {void}
     */
    loadCoinImages() {
        for (let i = 1; i <= 4; i++) {
            const image = new Image();
            image.src = `assets/4. Marcadores/1. Coins/${i}.png`;
            this.coinImages.push(image);
        }

        this.img = this.coinImages[0];
    }

    /**
     * Starts the coin animation.
     *
     * @returns {void}
     */
    animate() {
        this.animationInterval = setInterval(() => {
            const index = this.currentImage % this.coinImages.length;
            this.img = this.coinImages[index];
            this.currentImage++;
        }, 150);
    }

    /**
     * Marks the coin as collected.
     *
     * @returns {void}
     */
    collect() {
        this.collected = true;
        this.stopIntervals();
    }

    /**
     * Stops the coin animation interval.
     *
     * @returns {void}
     */
    stopIntervals() {
        clearInterval(this.animationInterval);
    }
}