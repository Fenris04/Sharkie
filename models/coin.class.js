
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

    /** @type {World|null} Reference to the current game world. */
    world = null;

    /**
     * Creates an animated coin at a world position.
     *
     * @param {number} x - Horizontal position.
     * @param {number} y - Vertical position.
     * @param {World|null} world - Current game world.
     */
    constructor(x, y, world = null) {
        super();

        this.x = x;
        this.y = y;
        this.world = world;

        this.loadCoinImages();
        this.animate();
    }

    /**
     * Connects the coin to its game world.
     *
     * @param {World} world - Current game world.
     * @returns {void}
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Checks whether the game world is paused or stopped.
     *
     * @returns {boolean} True when animation must wait.
     */
    isWorldPaused() {
        return this.world !== null &&
            (this.world.paused || !this.world.running);
    }

    /**
     * Loads all four coin animation frames.
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
        if (this.animationInterval !== null) return;

        this.animationInterval = setInterval(() => {
            if (this.isWorldPaused() || this.collected) return;
            this.updateAnimation();
        }, 150);
    }

    /**
     * Displays the next coin animation frame.
     *
     * @returns {void}
     */
    updateAnimation() {
        const index = this.currentImage % this.coinImages.length;

        this.img = this.coinImages[index];
        this.currentImage++;
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
        this.animationInterval = null;
    }
}
