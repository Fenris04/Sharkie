/**
 * Represents a purple jellyfish enemy.
 */
class JellyFish extends MovableObject {
    /** @type {number} Width of the jellyfish. */
    width = 90;
    /** @type {number} Height of the jellyfish. */
    height = 110;
    /** @type {number} Movement speed. */
    speed = 0.4;

    /** @type {number} Current swimming animation frame. */
    currentImage = 0;

    /** @type {number} Top collision offset. */
    offsetTop = 15;
    /** @type {number} Right collision offset. */
    offsetRight = 15;
    /** @type {number} Bottom collision offset. */
    offsetBottom = 15;
    /** @type {number} Left collision offset. */
    offsetLeft = 15;

    /** @type {HTMLImageElement[]} Swimming animation frames. */
    swimImages = [];

    /** @type {HTMLImageElement[]} Death animation frames. */
    deadImages = [];

    /** @type {boolean} Whether the jellyfish was defeated. */
    dead = false;

    /** @type {boolean} Whether the death animation has finished. */
    deathAnimationFinished = false;

    /** @type {number} Current death animation frame. */
    deathImageIndex = 0;

    /** @type {number} Starting vertical position. */
    startY;

    /** @type {number} Current movement phase. */
    movementPhase = 0;

    /** @type {number | null} Movement interval identifier. */
    movementInterval = null;

    /** @type {number | null} Animation interval identifier. */
    animationInterval = null;


    /**
     * Creates a jellyfish at the given position.
     *
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     */
    constructor(x, y) {
        super();

        this.x = x;
        this.y = y;
        this.startY = y;

        this.loadSwimImages();
        this.loadDeadImages();
        this.startMovement();
        this.animate();
    }

    /**
     * Loads the purple jellyfish swimming frames.
     *
     * @returns {void}
     */
    loadSwimImages() {
        for (let i = 1; i <= 4; i++) {
            const image = new Image();
            image.src = `assets/2.Enemy/2 Jelly fish/Regular damage/Lila ${i}.png`;
            this.swimImages.push(image);
        }

        this.img = this.swimImages[0];
    }

    /**
     * Loads the purple jellyfish death frames.
     *
     * @returns {void}
     */
    loadDeadImages() {
        for (let i = 1; i <= 4; i++) {
            const image = new Image();
            image.src = `assets/2.Enemy/2 Jelly fish/Dead/Lila/L${i}.png`;
            this.deadImages.push(image);
        }
    }

    /**
     * Starts the jellyfish movement loop.
     *
     * @returns {void}
     */
    startMovement() {
        this.movementInterval = setInterval(() => {
            if (!this.dead) this.move();
        }, 1000 / 60);
    }

    /**
     * Moves the jellyfish left while gently floating up and down.
     *
     * @returns {void}
     */
    move() {
        this.moveLeft();
        this.movementPhase += 0.025;
        this.y = this.startY + Math.sin(this.movementPhase) * 25;
    }

    /**
     * Starts the jellyfish animation loop.
     *
     * @returns {void}
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.updateAnimation();
        }, 150);
    }

    /**
     * Selects the swimming or death animation.
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.dead) {
            this.playDeathAnimation();
        } else {
            this.playSwimAnimation();
        }
    }

    /**
     * Plays the swimming animation continuously.
     *
     * @returns {void}
     */
    playSwimAnimation() {
        const index = this.currentImage % this.swimImages.length;
        this.img = this.swimImages[index];
        this.currentImage++;
    }

    /**
     * Plays the death animation exactly once.
     *
     * @returns {void}
     */
    playDeathAnimation() {
        if (this.deathAnimationFinished) return;

        if (this.deathImageIndex >= this.deadImages.length) {
            this.deathAnimationFinished = true;
            return;
        }

        this.img = this.deadImages[this.deathImageIndex];
        this.deathImageIndex++;
    }

    /**
     * Starts the jellyfish death animation.
     *
     * @returns {void}
     */
    die() {
        if (this.dead) return;

        this.dead = true;
        this.deathImageIndex = 0;
        this.img = this.deadImages[0];
        this.deathImageIndex = 1;

        clearInterval(this.movementInterval);
    }

    /**
     * Checks whether the jellyfish was defeated.
     *
     * @returns {boolean} True if defeated.
     */
    isDead() {
        return this.dead;
    }

    /**
     * Checks whether the death animation has finished.
     *
     * @returns {boolean} True when all death frames were played.
     */
    isDeathAnimationFinished() {
        return this.dead && this.deathAnimationFinished;
    }

    /**
     * Stops all jellyfish intervals.
     *
     * @returns {void}
     */
    stopIntervals() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }
}