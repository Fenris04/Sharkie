
/**
 * Displays coin collection progress using the provided HUD images.
 */
class CoinStatusBar extends DrawableObject {
    /** @type {number} Horizontal screen position. */
    x = 20;

    /** @type {number} Vertical screen position. */
    y = 65;

    /** @type {number} Display width. */
    width = 200;

    /** @type {number} Display height. */
    height = 55;

    /** @type {number} Current collection percentage. */
    percentage = 0;

    /** @type {HTMLImageElement[]} Coin progress images. */
    images = [];

    /**
     * Creates the coin progress bar.
     *
     * @returns {void}
     */
    constructor() {
        super();
        this.loadImages();
        this.setPercentage(0);
    }

    /**
     * Loads all coin progress images.
     *
     * @returns {void}
     */
    loadImages() {
        const filenames = [
            '0_  copia 4.png',
            '20_  copia 2.png',
            '40_  copia 4.png',
            '60_  copia 4.png',
            '80_  copia 4.png',
            '100_  copia 4.png'
        ];

        filenames.forEach(filename => {
            const image = new Image();
            image.src = `assets/4. Marcadores/green/Coin/${filename}`;
            this.images.push(image);
        });
    }

    /**
     * Updates the displayed collection percentage.
     *
     * @param {number} percentage - Progress from 0 to 100.
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        const index = Math.min(5, Math.floor(this.percentage / 20));
        this.img = this.images[index];
    }
}
