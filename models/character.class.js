/**
 * Represents the playable character Sharkie.
 */
class Character extends MovableObject {

    /** @type {number} Horizontal start position of Sharkie. */
    x = 100;

    /** @type {number} Vertical start position of Sharkie. */
    y = 100;

    /** @type {number} Width of Sharkie. */
    width = 300;

    /** @type {number} Height of Sharkie. */
    height = 250;

    /** @type {number} Index of the current animation frame. */
    currentImage = 0;

    /** @type {HTMLImageElement[]} Images of the idle animation. */
    idleImages = [];


    /**
     * Creates Sharkie and starts the idle animation.
     */
    constructor() {
        super();
        this.loadIdleImages();
        this.animate();
    }


    /**
     * Loads all frames of Sharkie's idle animation.
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
     * Starts Sharkie's animation loop.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playIdleAnimation();
        }, 150);
    }


    /**
     * Displays the next frame of the idle animation.
     *
     * @returns {void}
     */
    playIdleAnimation() {
        const index = this.currentImage % this.idleImages.length;
        this.img = this.idleImages[index];
        this.currentImage++;
    }

    /**
    * Checks whether Sharkie can move to the right.
     *
    * @returns {boolean} True if Sharkie is inside the right boundary.
    */
    canMoveRight() {
        return this.x + this.width < 720;
    }


    /**
    * Checks whether Sharkie can move to the left.
     *
    * @returns {boolean} True if Sharkie is inside the left boundary.
    */
    canMoveLeft() {
        return this.x > 0;
    }


    /**
    * Checks whether Sharkie can move upwards.
     *
    * @returns {boolean} True if Sharkie is inside the upper boundary.
    * /
    canMoveUp() {
        return this.y > 0;
    }


    /**
    * Checks whether Sharkie can move downwards.
    *
    * @returns {boolean} True if Sharkie is inside the lower boundary.
    */
    canMoveDown() {
      return this.y + this.height < 480;
    }
}

