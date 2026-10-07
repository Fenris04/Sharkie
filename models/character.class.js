/**
 * Represents the playable character Sharkie.
 * Handles Sharkie's movement and animations.
 */
class Character extends MovableObject {

    /** @type {number} Horizontal start position of Sharkie. */
    x = 100;

    /** @type {number} Vertical start position of Sharkie. */
    y = 100;

    /** @type {number} Width of Sharkie in pixels. */
    width = 300;

    /** @type {number} Height of Sharkie in pixels. */
    height = 250;

    /** @type {number} Index of the current animation frame. */
    currentImage = 0;

    /** @type {HTMLImageElement[]} Images used for the idle animation. */
    idleImages = [];

    /** @type {HTMLImageElement[]} Images used for the swim animation. */
    swimImages = [];

    /** @type {Object} Current keyboard input state. */
    keyboard;

    /** @type {World} Reference to the current game world. */
    world;

    /** @type {number} Empty space above Sharkie's collision area. */
    offsetTop = 105;

    /** @type {number} Empty space on Sharkie's right side. */
    offsetRight = 55;

    /** @type {number} Empty space below Sharkie's collision area. */
    offsetBottom = 70;

    /** @type {number} Empty space on Sharkie's left side. */
    offsetLeft = 65;

    /**
    * Creates Sharkie and prepares his animations and controls.
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
     * Loads all frames of Sharkie's swim animation.
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
     * Starts Sharkie's animation loop.
     *
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.isMoving()) {
                this.playAnimation(this.swimImages);
            } else {
                this.playAnimation(this.idleImages);
            }
        }, 150);
    }


    /**
     * Plays an animation using the provided image sequence.
     *
     * @param {HTMLImageElement[]} images - Images of the animation.
     * @returns {void}
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        this.img = images[index];
        this.currentImage++;
    }


    /**
     * Updates Sharkie's position according to the keyboard input.
     *
     * @returns {void}
     */
    move() {
        this.moveHorizontally();
        this.moveVertically();
    }

    /**
    * Moves Sharkie horizontally and updates his facing direction.
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
 * Moves Sharkie vertically.
 *
 * @returns {void}
 */
moveVertically() {
    if (this.keyboard.UP && this.canMoveUp()) this.moveUp();
    if (this.keyboard.DOWN && this.canMoveDown()) this.moveDown();
}


    /**
     * Checks whether Sharkie is currently being moved.
     *
     * @returns {boolean} True if a movement key is pressed.
     */
    isMoving() {
        return this.keyboard.RIGHT ||
            this.keyboard.LEFT ||
            this.keyboard.UP ||
            this.keyboard.DOWN;
    }


    /**
    * Checks whether Sharkie can move further to the right.
    *
    * @returns {boolean} True if Sharkie has not reached the level end.
    */
    canMoveRight() {
        return this.x + this.width < this.world.levelWidth;
    }

    /**
     * Checks whether Sharkie can move further to the left.
     *
     * @returns {boolean} True if Sharkie has not reached the level start.
     */
    canMoveLeft() {
        return this.x > 0;
    }


    /**
     * Checks whether Sharkie can move upwards.
     *
     * @returns {boolean} True if Sharkie is inside the upper boundary.
     */
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