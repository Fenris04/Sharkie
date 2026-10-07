/**
 * Represents Sharkie's health status bar.
 * Displays the current amount of energy.
 */
class StatusBar extends DrawableObject {

    /** @type {number} Current health percentage. */
    percentage = 100;

    /** @type {HTMLImageElement[]} Images for all health states. */
    healthImages = [];


    /**
     * Creates the health status bar and loads all required images.
     */
    constructor() {
        super();

        this.x = 20;
        this.y = 20;
        this.width = 200;
        this.height = 60;

        this.loadHealthImages();
        this.setPercentage(100);
    }


    /**
     * Loads all images used by the health status bar.
     *
     * @returns {void}
     */
    loadHealthImages() {
        const percentages = [0, 20, 40, 60, 80, 100];

        percentages.forEach(percentage => {
            const image = new Image();
            image.src = this.getImagePath(percentage);
            this.healthImages.push(image);
        });
    }


    /**
     * Returns the correct image path for a health percentage.
     *
     * @param {number} percentage - Health value of the requested image.
     * @returns {string} Path to the health image.
     */
    getImagePath(percentage) {
        const files = {
            0: '0_  copia 3.png',
            20: '20_ copia 4.png',
            40: '40_  copia 3.png',
            60: '60_  copia 3.png',
            80: '80_  copia 3.png',
            100: '100_  copia 2.png'
        };

        return `assets/4. Marcadores/green/Life/${files[percentage]}`;
    }


    /**
     * Updates the displayed health percentage.
     *
     * @param {number} percentage - Current health percentage.
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.healthImages[this.resolveImageIndex()];
    }


    /**
     * Determines which health image matches the current percentage.
     *
     * @returns {number} Index of the matching health image.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}