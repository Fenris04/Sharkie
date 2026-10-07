/**
 * Represents a game object that can move through the game world.
 */
class MovableObject extends DrawableObject {

    /** @type {number} Movement speed in pixels. */
    speed = 5;

    /** @type {boolean} Indicates whether the object should be flipped horizontally. */
    otherDirection = false;


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
}