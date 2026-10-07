/**
 * Represents the playable character Sharkie.
 */
class Character extends MovableObject {

    /** @type {number} Horizontal start position of Sharkie. */
    x = 100;

    /** @type {number} Vertical start position of Sharkie. */
    y = 100;

    /** @type {number} Width of Sharkie. */
    width = 300;

    /** @type {number} Height of Sharkie. */
    height = 250;

    /** @type {number} Index of the current animation frame. */
    currentImage = 0;

    /** @type {HTMLImageElement[]} Images of the idle animation. */
    idleImages = [];


    /**
     * Creates Sharkie and starts the idle animation.
     */
    constructor() {
        super();
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
    * Checks whether Sharkie can move to the right.
     *
    * @returns {boolean} True if Sharkie is inside the right boundary.
    */
    canMoveRight() {
        return this.x + this.width < 720;
    }


    /**
    * Checks whether Sharkie can move to the left.
     *
    * @returns {boolean} True if Sharkie is inside the left boundary.
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

    /** @type {HTMLImageElement[]} Images used for the swim animation. */
    swimImages = [];

    /**
    * Checks whether Sharkie is currently moving.
    *
    * @returns {boolean} True if a movement key is pressed.
    */
    isMoving() {
        return keyboard.RIGHT ||
            keyboard.LEFT ||
            keyboard.UP ||
            keyboard.DOWN;
    }    
}

