
/**
 * Represents a puffer fish enemy.
 * Handles movement, swimming and death behavior.
 */
class PufferFish extends MovableObject {

    /** @type {number} Width of the enemy. */
    width = 100;

    /** @type {number} Height of the enemy. */
    height = 80;

    /** @type {number} Movement speed of the enemy. */
    speed = 1;

    /** @type {number} Index of the current animation frame. */
    currentImage = 0;

    /** @type {boolean} Indicates whether the enemy is dead. */
    dead = false;

    /** @type {HTMLImageElement[]} Images used for swimming. */
    swimImages = [];

    /** @type {HTMLImageElement|null} Image used after a fin-slap hit. */
    deadImage = null;

    /** @type {number|null} ID of the movement interval. */
    movementInterval = null;

    /** @type {number|null} ID of the animation interval. */
    animationInterval = null;

    /** @type {World|null} Reference to the game world. */
    world = null;

    /** @type {number} Top offset of the collision box. */
    offsetTop = 10;

    /** @type {number} Right offset of the collision box. */
    offsetRight = 10;

    /** @type {number} Bottom offset of the collision box. */
    offsetBottom = 18;

    /** @type {number} Left offset of the collision box. */
    offsetLeft = 10;

    /**
     * Creates a new puffer fish.
     *
     * @param {number} x - Horizontal start position.
     * @param {number} y - Vertical start position.
     * @param {World|null} world - Current game world.
     */
    constructor(x, y, world = null) {
        super();
        this.x = x;
        this.y = y;
        this.world = world;
        this.loadSwimImages();
        this.loadDeadImage();
        this.animate();
    }

    /**
     * Loads all swimming animation images.
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
     * Returns the path of a swimming animation frame.
     *
     * @param {number} frame - Number of the requested frame.
     * @returns {string} Path to the animation image.
     */
    getSwimImagePath(frame) {
        return `assets/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim${frame}.png`;
    }

    /**
     * Loads the image used after a fin slap.
     *
     * @returns {void}
     */
    loadDeadImage() {
        this.deadImage = new Image();
        this.deadImage.src =
            'assets/2.Enemy/1.Puffer fish (3 color options)/4.DIE/' +
            '1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png';
    }

    /**
     * Starts movement and animation intervals.
     *
     * @returns {void}
     */
    animate() {
        this.startMovement();
        this.startSwimAnimation();
    }

    /**
     * Checks whether the current world is paused.
     *
     * @returns {boolean} True when gameplay is paused.
     */
    isWorldPaused() {
        return this.world !== null &&
            (this.world.paused || !this.world.running);
    }

    /**
     * Starts the automatic enemy movement.
     *
     * @returns {void}
     */
    startMovement() {
        this.movementInterval = setInterval(() => {
            if (this.isWorldPaused()) return;
            this.updateMovement();
        }, 1000 / 60);
    }

    /**
     * Updates the enemy position.
     *
     * @returns {void}
     */
    updateMovement() {
        if (this.dead) {
            this.moveDeadEnemy();
        } else {
            this.moveLeft();
        }
    }

    /**
     * Moves a defeated enemy toward the bottom.
     *
     * @returns {void}
     */
    moveDeadEnemy() {
        this.y += 3;
    }

    /**
     * Starts the swimming animation.
     *
     * @returns {void}
     */
    startSwimAnimation() {
        this.animationInterval = setInterval(() => {
            if (this.isWorldPaused()) return;
            this.updateAnimation();
        }, 150);
    }

    /**
     * Updates the currently displayed enemy image.
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.dead) {
            this.img = this.deadImage;
        } else {
            this.playAnimation();
        }
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
    * Defeats the enemy and plays its death sound.
    *
    * @returns {void}
    */
    die() {
        if (this.dead) return;

        this.dead = true;
        this.img = this.deadImage;

        audioManager.playSound('pop', 0.6, 1.2);
    }

    /**
     * Checks whether the enemy has been defeated.
     *
     * @returns {boolean} True when the enemy is dead.
     */
    isDead() {
        return this.dead;
    }

    /**
     * Stops all running enemy intervals.
     *
     * @returns {void}
     */
    stopIntervals() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }
}
