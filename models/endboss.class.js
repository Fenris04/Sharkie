/**
 * Represents the final boss and manages its animations and health.
 */
class Endboss extends MovableObject {
    /** @type {number} Horizontal world position. */
    x = 9400;

    /** @type {number} Vertical world position. */
    y = 40;

    /** @type {number} Boss width. */
    width = 450;

    /** @type {number} Boss height. */
    height = 400;

    /** @type {number} Current health. */
    energy = 100;

    /** @type {number} Maximum health. */
    maxEnergy = 100;

    /** @type {number} Current animation frame. */
    currentImage = 0;

    /** @type {number} Character position that activates the boss. */
    activationX = 7500;

    /** @type {boolean} Whether the boss has been activated. */
    activated = false;

    /** @type {boolean} Whether the introduction has finished. */
    introductionFinished = false;

    /** @type {number|null} Animation interval identifier. */
    animationInterval = null;

    /** @type {Object.<string, HTMLImageElement>} Loaded animation images. */
    imageCache = {};

    /** @type {string[]} Introduction image paths. */
    IMAGES_INTRODUCE = [];

    /** @type {string[]} Floating image paths. */
    IMAGES_FLOATING = [];

    /** @type {string[]} Hurt image paths. */
    IMAGES_HURT = [];

    /** @type {number} Timestamp of the last successful hit. */
    lastHit = 0;

    /** @type {number} Minimum time between successful hits in milliseconds. */
    hitCooldown = 500;

    /** @type {boolean} Whether the hurt animation is playing. */
    isHurt = false;

    /** @type {number} Current hurt animation frame. */
    hurtImageIndex = 0;

    /** @type {string[]} Death animation image paths. */
  IMAGES_DEAD = [];

  /** @type {boolean} Whether the death animation has started. */
  deathAnimationStarted = false;

  /** @type {boolean} Whether the death animation has finished. */
  deathAnimationFinished = false;

  /** @type {number} Current death animation frame. */
  deathImageIndex = 0;

  /** @type {number} Timestamp of the last death animation frame. */
  lastDeathFrameTime = 0;

    /**
     * Creates the final boss and loads its animations.
     */
    constructor() {
        super();

        this.IMAGES_INTRODUCE = this.createImagePaths(
            'assets/2.Enemy/3 Final Enemy/1.Introduce/',
            10
        );

        this.IMAGES_FLOATING = this.createImagePaths(
            'assets/2.Enemy/3 Final Enemy/2.floating/',
            13
        );

        this.IMAGES_HURT = this.createImagePaths(
            'assets/2.Enemy/3 Final Enemy/Hurt/',
             4
        );

        this.IMAGES_DEAD = [
          'assets/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png',
          'assets/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png',
          'assets/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png',
          'assets/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png',
          'assets/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png',
          'assets/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2.png'
        ];

        this.preloadAnimationImages(this.IMAGES_INTRODUCE);
        this.preloadAnimationImages(this.IMAGES_FLOATING);
        this.preloadAnimationImages(this.IMAGES_HURT);
        this.preloadAnimationImages(this.IMAGES_DEAD);

        this.loadImage(this.IMAGES_INTRODUCE[0]);
    }

    /**
     * Creates paths for numbered animation frames.
     *
     * @param {string} folder - Image folder.
     * @param {number} count - Number of frames.
     * @returns {string[]} Image paths.
     */
    createImagePaths(folder, count) {
        return Array.from(
            { length: count },
            (_, index) => `${folder}${index + 1}.png`
        );
    }

    /**
     * Loads animation frames into the image cache.
     *
     * @param {string[]} paths - Paths to preload.
     * @returns {void}
     */
    preloadAnimationImages(paths) {
        paths.forEach(path => {
            const image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        });
    }

    /**
     * Activates the boss when Sharkie reaches the boss area.
     *
     * @param {number} characterX - Sharkie's horizontal position.
     * @returns {void}
     */
    checkActivation(characterX) {
        if (this.activated || characterX < this.activationX) {
            return;
        }

        this.activated = true;
        this.currentImage = 0;
        this.animate();
    }

    /**
     * Starts the boss animation interval.
     *
     * @returns {void}
     */
    animate() {
        if (this.animationInterval !== null) return;

        this.animationInterval = setInterval(() => {
          if (this.deathAnimationStarted) {
              this.updateAnimation();
              return;
          }

          this.updateAnimation();
      }, 150);
    }

    /**
     * Selects the current boss animation.
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.deathAnimationStarted) {
          this.playDeathAnimation();
        } else if (!this.introductionFinished) {
          this.playIntroduction();
        } else if (this.isHurt) {
          this.playHurtAnimation();
        } else {
          this.playFloatingAnimation();
      }
    }

    /**
     * Plays the introduction once.
     *
     * @returns {void}
     */
    playIntroduction() {
        const path = this.IMAGES_INTRODUCE[this.currentImage];

        this.showImage(path);
        this.currentImage++;

        if (this.currentImage >= this.IMAGES_INTRODUCE.length) {
            this.introductionFinished = true;
            this.currentImage = 0;
        }
    }

    /**
     * Plays the floating animation repeatedly.
     *
     * @returns {void}
     */
    playFloatingAnimation() {
        const index = this.currentImage % this.IMAGES_FLOATING.length;

        this.showImage(this.IMAGES_FLOATING[index]);
        this.currentImage++;
    }

    /**
     * Plays the hurt animation once.
     *
     * @returns {void}
     */
    playHurtAnimation() {
        const path = this.IMAGES_HURT[this.hurtImageIndex];

        this.showImage(path);
        this.hurtImageIndex++;

        if (this.hurtImageIndex >= this.IMAGES_HURT.length) {
            this.isHurt = false;
            this.hurtImageIndex = 0;
            this.currentImage = 0;
        }
    }

    /**
     * Applies damage when the boss can receive another hit.
     *
     * @param {number} damage - Amount of damage.
     * @returns {boolean} True when damage was applied.
     */
    hit(damage) {
        if (!this.canReceiveDamage()) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();

        this.isHurt = true;
        this.hurtImageIndex = 0;

        return true;
    }

    /**
     * Checks whether the boss can receive damage.
     *
     * @returns {boolean} True when the boss can be hit.
     */
    canReceiveDamage() {
        return this.activated &&
            this.introductionFinished &&
            this.energy > 0 &&
            Date.now() - this.lastHit >= this.hitCooldown;
    }

    /**
     * Checks whether the boss has no health remaining.
     *
     * @returns {boolean} True when the boss is defeated.
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Displays a loaded animation image.
     *
     * @param {string} path - Image path.
     * @returns {void}
     */
    showImage(path) {
        const image = this.imageCache[path];

        if (image && image.complete && image.naturalWidth > 0) {
            this.img = image;
        }
    }

    /**
     * Stops the boss animation interval.
     *
     * @returns {void}
     */
    stopIntervals() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
    }

    /**
  * Starts the boss death animation after the camera arrives.
  *
  * @returns {void}
  */
  startDeathAnimation() {
    if (this.deathAnimationStarted) return;

      this.deathAnimationStarted = true;
      this.deathAnimationFinished = false;
      this.deathImageIndex = 0;
      this.isHurt = false;
  }

  /**
  * Plays the boss death animation slowly and exactly once.
  *
  * @returns {void}
  */
  playDeathAnimation() {
    if (this.deathAnimationFinished) return;

    const now = Date.now();
    const frameDelay = 150;

    if (now - this.lastDeathFrameTime < frameDelay) {
        return;
    }

    this.lastDeathFrameTime = now;

    if (this.deathImageIndex < this.IMAGES_DEAD.length) {
        const path = this.IMAGES_DEAD[this.deathImageIndex];

        this.showImage(path);
        this.deathImageIndex++;
        return;
    }

    this.finishDeathAnimation();
  }

  /**
  * Finishes the death animation and keeps the final frame visible.
  *
  * @returns {void}
  */
  finishDeathAnimation() {
      const lastIndex = this.IMAGES_DEAD.length - 1;

      this.showImage(this.IMAGES_DEAD[lastIndex]);
      this.deathAnimationFinished = true;
  }
}