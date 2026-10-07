/**
 * Represents a puffer fish enemy.
 * The enemy swims automatically through the game world.
 */
class PufferFish extends MovableObject {

    /** @type {number} Width of the puffer fish in pixels. */
    width = 100;

    /** @type {number} Height of the puffer fish in pixels. */
    height = 80;

    /** @type {number} Movement speed of the puffer fish. */
    speed = 1;

    /** @type {number} Index of the current animation frame. */
    currentImage = 0;

    /** @type {HTMLImageElement[]} Images used for the swim animation. */
    swimImages = [];


    /**
     * Creates a new puffer fish at the given position.
     *
     * @param {number} x - Horizontal start position.
     * @param {number} y - Vertical start position.
     */
    constructor(x, y) {
        super();

        this.x = x;
        this.y = y;

        this.loadSwimImages();
        this.animate();
    }


    /**
     * Loads all frames of the puffer fish swim animation.
     *
     * @returns {void}
     */
    loadSwimImages() {
        for (let i = 1; i <= 5; i++) {
            const image = new Image();
            image.src = this.getSwimImagePath(i);
            this.swimImages.push(image);
        }
    }


    /**
     * Returns the path of a swim animation frame.
     *
     * @param {number} frame - Number of the animation frame.
     * @returns {string} Path to the image.
     */
    getSwimImagePath(frame) {
        return `assets/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim${frame}.png`;
    }


    /**
     * Starts movement and animation of the puffer fish.
     *
     * @returns {void}
     */
    animate() {
        this.startMovement();
        this.startSwimAnimation();
    }


    /**
     * Continuously moves the puffer fish to the left.
     *
     * @returns {void}
     */
    startMovement() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }


    /**
     * Continuously plays the swim animation.
     *
     * @returns {void}
     */
    startSwimAnimation() {
        setInterval(() => {
            this.playAnimation();
        }, 150);
    }


    /**
     * Displays the next frame of the swim animation.
     *
     * @returns {void}
     */
    playAnimation() {
        const index = this.currentImage % this.swimImages.length;
        this.img = this.swimImages[index];
        this.currentImage++;
    }
}