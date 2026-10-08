/**
 * Represents a jellyfish enemy.
 * Moves through the water with a gentle vertical motion.
 */
class JellyFish extends MovableObject {

    /** @type {number} Width of the jellyfish. */
    width = 90;

    /** @type {number} Height of the jellyfish. */
    height = 110;

    /** @type {number} Horizontal movement speed. */
    speed = 0.4;

    /** @type {number} Current animation frame index. */
    currentImage = 0;

    /** @type {HTMLImageElement[]} Swimming animation frames. */
    swimImages = [];

    /** @type {number} Original vertical position. */
    startY = 0;

    /** @type {number} Current movement phase. */
    movementPhase = 0;

    /** @type {number|null} Movement interval ID. */
    movementInterval = null;

    /** @type {number|null} Animation interval ID. */
    animationInterval = null;

    /** @type {number} Top collision offset. */
    offsetTop = 15;

    /** @type {number} Right collision offset. */
    offsetRight = 15;

    /** @type {number} Bottom collision offset. */
    offsetBottom = 15;

    /** @type {number} Left collision offset. */
    offsetLeft = 15;


    /**
     * Creates a jellyfish at the given position.
     *
     * @param {number} x - Horizontal start position.
     * @param {number} y - Vertical start position.
     */
    constructor(x, y) {
        super();

        this.x = x;
        this.y = y;
        this.startY = y;

        this.loadSwimImages();
        this.animate();
    }


    /**
     * Loads the four purple jellyfish swimming frames.
     *
     * @returns {void}
     */
    loadSwimImages() {
        for (let i = 1; i <= 4; i++) {
            const image = new Image();
            image.src = this.getSwimImagePath(i);
            this.swimImages.push(image);
        }
    }


    /**
     * Returns the path to a swimming animation frame.
     *
     * @param {number} frame - Requested frame number.
     * @returns {string} Image path.
     */
    getSwimImagePath(frame) {
        return `assets/2.Enemy/2 Jelly fish/Regular damage/Lila ${frame}.png`;
    }


    /**
     * Starts movement and swimming animation.
     *
     * @returns {void}
     */
    animate() {
        this.startMovement();
        this.startSwimAnimation();
    }


    /**
     * Starts the jellyfish movement loop.
     *
     * @returns {void}
     */
    startMovement() {
        this.movementInterval = setInterval(() => {
            this.updateMovement();
        }, 1000 / 60);
    }


    /**
     * Moves the jellyfish left while gently floating up and down.
     *
     * @returns {void}
     */
    updateMovement() {
        this.moveLeft();
        this.movementPhase += 0.025;
        this.y = this.startY + Math.sin(this.movementPhase) * 25;
    }


    /**
     * Starts the swimming animation loop.
     *
     * @returns {void}
     */
    startSwimAnimation() {
        this.animationInterval = setInterval(() => {
            this.playAnimation();
        }, 150);
    }


    /**
     * Displays the next swimming animation frame.
     *
     * @returns {void}
     */
    playAnimation() {
        const index = this.currentImage % this.swimImages.length;

        this.img = this.swimImages[index];
        this.currentImage++;
    }


    /**
     * Stops all active jellyfish intervals.
     *
     * @returns {void}
     */
    stopIntervals() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }
}