/**
 * Represents a background image in the game world.
 */
class BackgroundObject extends DrawableObject {

    /**
     * Creates a new background object.
     *
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal position of the background.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);

        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}