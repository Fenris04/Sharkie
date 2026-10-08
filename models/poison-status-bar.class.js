
/**
 * Displays Sharkie's remaining poison ammunition.
 */
class PoisonStatusBar extends DrawableObject {
    /** @type {number} Horizontal position on the canvas. */
    x = 20;

    /** @type {number} Vertical position on the canvas. */
    y = 115;

    /** @type {number} Width of the status bar. */
    width = 200;

    /** @type {number} Height of the status bar. */
    height = 55;

    /** @type {number} Current poison percentage. */
    percentage = 100;

    /** @type {HTMLImageElement[]} Poison status bar images. */
    images = [];

    /**
     * Creates the poison ammunition status bar.
     */
    constructor() {
        super();
        this.loadPoisonImages();
        this.setPercentage(100);
    }

    /**
     * Loads all six poison status bar images.
     *
     * @returns {void}
     */
    loadPoisonImages() {
        const values = [0, 20, 40, 60, 80, 100];

        values.forEach(value => {
            const image = new Image();
            image.src = `assets/4. Marcadores/Purple/${value}_.png`;
            this.images.push(image);
        });
    }

    /**
     * Updates the displayed poison percentage.
     *
     * @param {number} percentage - Value between 0 and 100.
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));

        const index = Math.min(5, Math.floor(this.percentage / 20));
        this.img = this.images[index];
    }
}
