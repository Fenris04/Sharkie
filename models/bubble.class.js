
/**
 * Represents a bubble projectile fired by Sharkie.
 */
class Bubble extends MovableObject {

    /** @type {number} Width of the bubble. */
    width = 60;

    /** @type {number} Height of the bubble. */
    height = 60;

    /** @type {number} Movement speed of the bubble. */
    speed = 7;

    /** @type {boolean} Whether the bubble has hit an enemy. */
    hasHit = false;

    /** @type {World|null} Reference to the current game world. */
    world = null;

    /**
     * Creates a bubble at the given position.
     *
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     * @param {boolean} otherDirection - Whether Sharkie faces left.
     * @param {World|null} world - Current game world.
     */
    constructor(x, y, otherDirection, world = null) {
        super();

        this.x = x;
        this.y = y;
        this.otherDirection = otherDirection;
        this.world = world;

        this.loadImage(
            'assets/1.Sharkie/4.Attack/Bubble trap/Bubble.png'
        );
    }

    /**
     * Connects the bubble to its game world.
     *
     * @param {World} world - Current game world.
     * @returns {void}
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Checks whether the game world is paused or stopped.
     *
     * @returns {boolean} True when movement must stop.
     */
    isWorldPaused() {
        return this.world !== null &&
            (this.world.paused || !this.world.running);
    }

    /**
     * Moves the bubble in Sharkie's facing direction.
     *
     * @returns {void}
     */
    move() {
        if (this.isWorldPaused() || this.hasHit) return;
        this.x += this.otherDirection ? -this.speed : this.speed;
    }
}
