/**
 * Represents a game object that can move through the game world.
 */
class MovableObject extends DrawableObject {

    /** @type {number} Movement speed in pixels. */
    speed = 4.5;

    /** @type {boolean} Whether the object faces left. */
    otherDirection = false;

    /** @type {number} Empty space above the visible object. */
    offsetTop = 0;

    /** @type {number} Empty space on the right side. */
    offsetRight = 0;

    /** @type {number} Empty space below the visible object. */
    offsetBottom = 0;

    /** @type {number} Empty space on the left side. */
    offsetLeft = 0;

    /**
     * Moves the object to the right.
     *
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     *
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Moves the object upwards.
     *
     * @returns {void}
     */
    moveUp() {
        this.y -= this.speed;
    }

    /**
     * Moves the object downwards.
     *
     * @returns {void}
     */
    moveDown() {
        this.y += this.speed;
    }

    /**
     * Checks whether this object collides with another object.
     * Uses the hitbox offsets of both objects.
     *
     * @param {MovableObject} object - Object to check.
     * @returns {boolean} True if the hitboxes overlap.
     */
    isColliding(object) {
        return this.getRight() > object.getLeft() &&
            this.getLeft() < object.getRight() &&
            this.getBottom() > object.getTop() &&
            this.getTop() < object.getBottom();
    }

    /**
     * Returns the left edge of the object's hitbox.
     * Takes horizontal flipping into account.
     *
     * @returns {number} Left hitbox position.
     */
    getLeft() {
        const offset = this.otherDirection
            ? this.offsetRight
            : this.offsetLeft;

        return this.x + offset;
    }

    /**
     * Returns the right edge of the object's hitbox.
     * Takes horizontal flipping into account.
     *
     * @returns {number} Right hitbox position.
     */
    getRight() {
        const offset = this.otherDirection
            ? this.offsetLeft
            : this.offsetRight;

        return this.x + this.width - offset;
    }

    /**
     * Returns the upper edge of the object's hitbox.
     *
     * @returns {number} Upper hitbox position.
     */
    getTop() {
        return this.y + this.offsetTop;
    }

    /**
     * Returns the lower edge of the object's hitbox.
     *
     * @returns {number} Lower hitbox position.
     */
    getBottom() {
        return this.y + this.height - this.offsetBottom;
    }

    /**
     * Draws the object's hitbox for debugging.
     *
     * @param {CanvasRenderingContext2D} ctx - Canvas context.
     * @returns {void}
     */
    drawHitbox(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.rect(
            this.getLeft(),
            this.getTop(),
            this.getHitboxWidth(),
            this.getHitboxHeight()
        );
        ctx.stroke();
    }

    /**
     * Returns the width of the object's hitbox.
     *
     * @returns {number} Hitbox width.
     */
    getHitboxWidth() {
        return this.width - this.offsetLeft - this.offsetRight;
    }

    /**
     * Returns the height of the object's hitbox.
     *
     * @returns {number} Hitbox height.
     */
    getHitboxHeight() {
        return this.height - this.offsetTop - this.offsetBottom;
    }
}