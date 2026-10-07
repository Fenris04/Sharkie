/**
 * Represents the playable character Sharkie.
 * Handles movement, animations, health and damage states.
 */
class Character extends MovableObject {

    /** @type {number} Horizontal position of Sharkie. */
    x = 100;

    /** @type {number} Vertical position of Sharkie. */
    y = 100;

    /** @type {number} Width of Sharkie. */
    width = 300;

    /** @type {number} Height of Sharkie. */
    height = 250;

    /** @type {number} Index of the currently displayed animation frame. */
    currentImage = 0;

    /** @type {number} Current amount of health. */
    energy = 100;

    /** @type {number} Time of the last successful hit. */
    lastHit = 0;

    /** @type {number} Time in milliseconds before Sharkie can be hit again. */
    hitCooldown = 1000;

    /** @type {boolean} Indicates whether the death animation has finished. */
    deathAnimationFinished = false;

    /** @type {HTMLImageElement[]} Images used for the idle animation. */
    idleImages = [];

    /** @type {HTMLImageElement[]} Images used for the swimming animation. */
    swimImages = [];

    /** @type {HTMLImageElement[]} Images used for the hurt animation. */
    hurtImages = [];

    /** @type {HTMLImageElement[]} Images used for the death animation. */
    deadImages = [];

    /** @type {Object} Current keyboard input state. */
    keyboard;

    /** @type {World} Reference to the current game world. */
    world;

    /** @type {number} Top offset of Sharkie's collision box. */
    offsetTop = 105;

    /** @type {number} Right offset of Sharkie's collision box. */
    offsetRight = 55;

    /** @type {number} Bottom offset of Sharkie's collision box. */
    offsetBottom = 70;

    /** @type {number} Left offset of Sharkie's collision box. */
    offsetLeft = 65;


    /**
     * Creates Sharkie and loads all required animations.
     *
     * @param {Object} keyboard - Current keyboard input state.
     * @param {World} world - Current game world.
     */
    constructor(keyboard, world) {
        super();

        this.keyboard = keyboard;
        this.world = world;

        this.loadIdleImages();
        this.loadSwimImages();
        this.loadHurtImages();
        this.loadDeadImages();

        this.animate();
    }


    /**
     * Loads all images used for Sharkie's idle animation.
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
     * Loads all images used for Sharkie's swimming animation.
     *
     * @returns {void}
     */
    loadSwimImages() {
        for (let i = 1; i <= 6; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/3.Swim/${i}.png`;
            this.swimImages.push(image);
        }
    }


    /**
     * Loads all images used when Sharkie is poisoned.
     *
     * @returns {void}
     */
    loadHurtImages() {
        for (let i = 1; i <= 5; i++) {
            const image = new Image();
            image.src =
                `assets/1.Sharkie/5.Hurt/1.Poisoned/${i}.png`;

            this.hurtImages.push(image);
        }
    }


    /**
     * Loads all images used for Sharkie's poisoned death animation.
     *
     * @returns {void}
     */
    loadDeadImages() {
        for (let i = 1; i <= 12; i++) {
            const image = new Image();
            image.src =
                `assets/1.Sharkie/6.dead/1.Poisoned/${i}.png`;

            this.deadImages.push(image);
        }
    }


    /**
     * Starts Sharkie's animation loop.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.updateAnimation();
        }, 150);
    }


    /**
     * Selects the animation matching Sharkie's current state.
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playAnimation(this.hurtImages);
        } else if (this.isMoving()) {
            this.playAnimation(this.swimImages);
        } else {
            this.playAnimation(this.idleImages);
        }
    }


    /**
     * Displays the next frame of a repeating animation.
     *
     * @param {HTMLImageElement[]} images - Animation frames to display.
     * @returns {void}
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;

        this.img = images[index];
        this.currentImage++;
    }


    /**
     * Plays the death animation once and keeps its final frame visible.
     *
     * @returns {void}
     */
    playDeathAnimation() {
        if (this.deathAnimationFinished) {
            return;
        }

        if (this.currentImage < this.deadImages.length) {
            this.img = this.deadImages[this.currentImage];
            this.currentImage++;
        } else {
            this.finishDeathAnimation();
        }
    }


    /**
     * Finishes the death animation and keeps its last frame visible.
     *
     * @returns {void}
     */
    finishDeathAnimation() {
        const lastImage = this.deadImages.length - 1;

        this.img = this.deadImages[lastImage];
        this.deathAnimationFinished = true;
    }


    /**
     * Moves Sharkie according to the current keyboard input.
     * Movement is disabled after Sharkie dies.
     *
     * @returns {void}
     */
    move() {
        if (this.isDead()) {
            return;
        }

        this.moveHorizontally();
        this.moveVertically();
    }


    /**
     * Handles horizontal movement and direction.
     *
     * @returns {void}
     */
    moveHorizontally() {
        if (this.keyboard.RIGHT && this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
        }

        if (this.keyboard.LEFT && this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }


    /**
     * Handles vertical movement.
     *
     * @returns {void}
     */
    moveVertically() {
        if (this.keyboard.UP && this.canMoveUp()) {
            this.moveUp();
        }

        if (this.keyboard.DOWN && this.canMoveDown()) {
            this.moveDown();
        }
    }


    /**
     * Checks whether a movement key is currently pressed.
     *
     * @returns {boolean} True when a movement key is pressed.
     */
    isMoving() {
        return this.keyboard.RIGHT ||
            this.keyboard.LEFT ||
            this.keyboard.UP ||
            this.keyboard.DOWN;
    }


    /**
     * Checks whether Sharkie can move farther to the right.
     *
     * @returns {boolean} True when movement is possible.
     */
    canMoveRight() {
        return this.x + this.width < this.world.levelWidth;
    }


    /**
     * Checks whether Sharkie can move farther to the left.
     *
     * @returns {boolean} True when movement is possible.
     */
    canMoveLeft() {
        return this.x > 0;
    }


    /**
     * Checks whether Sharkie can move farther upward.
     *
     * @returns {boolean} True when movement is possible.
     */
    canMoveUp() {
        return this.y > 0;
    }


    /**
     * Checks whether Sharkie can move farther downward.
     *
     * @returns {boolean} True when movement is possible.
     */
    canMoveDown() {
        return this.y + this.height < 480;
    }


    /**
     * Reduces Sharkie's health when the hit cooldown has expired.
     *
     * @param {number} damage - Amount of health to remove.
     * @returns {void}
     */
    hit(damage) {
        if (!this.canReceiveDamage() || this.isDead()) {
            return;
        }

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
        this.currentImage = 0;
    }


    /**
     * Checks whether Sharkie can currently receive damage.
     *
     * @returns {boolean} True when another hit can be received.
     */
    canReceiveDamage() {
        return Date.now() - this.lastHit > this.hitCooldown;
    }


    /**
     * Checks whether Sharkie is currently hurt.
     *
     * @returns {boolean} True shortly after receiving damage.
     */
    isHurt() {
        return Date.now() - this.lastHit < this.hitCooldown;
    }


    /**
     * Checks whether Sharkie has no health remaining.
     *
     * @returns {boolean} True when Sharkie is dead.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
    * Checks whether Sharkie's death animation has finished.
    *
    * @returns {boolean} True when Sharkie is dead and the animation is complete.
    */
    isDeathAnimationFinished() {
        return this.isDead() && this.deathAnimationFinished;
    }
}