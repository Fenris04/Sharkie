
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

    /** @type {World|null} Reference to the current game world. */
    world = null;

    /**
     * Creates a poison bottle at a world position.
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

        this.loadBottleImages();
        this.animate();
    }

    /**
     * Connects the bottle to its game world.
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
        if (this.animationInterval !== null) return;

        this.animationInterval = setInterval(() => {
            if (this.isWorldPaused() || this.collected) return;
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
        this.animationInterval = null;
    }
}
