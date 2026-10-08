/**
 * Represents a bubble projectile fired by Sharkie.
 */
class Bubble extends MovableObject {
    width = 60;
    height = 60;
    speed = 7;

    /** @type {boolean} Whether the bubble has hit an enemy. */
    hasHit = false;

    /**
     * Creates a bubble at the given position.
     *
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     * @param {boolean} otherDirection - Whether Sharkie faces left.
     */
    constructor(x, y, otherDirection) {
        super();

        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;

        this.loadImage(
            'assets/1.Sharkie/4.Attack/Bubble trap/Bubble.png'
        );
    }

    /**
     * Moves the bubble in Sharkie's facing direction.
     *
     * @returns {void}
     */
    move() {
        this.x += this.otherDirection ? -this.speed : this.speed;
    }
}