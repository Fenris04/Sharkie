
/**
 * Defines the final boss's properties and image resources.
 */
class EndbossBase extends MovableObject {

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

    /** @type {Object.<string, HTMLImageElement>} Loaded images. */
    imageCache = {};

    /** @type {string[]} Introduction image paths. */
    IMAGES_INTRODUCE = [];

    /** @type {string[]} Floating image paths. */
    IMAGES_FLOATING = [];

    /** @type {string[]} Hurt image paths. */
    IMAGES_HURT = [];

    /** @type {string[]} Attack image paths. */
    IMAGES_ATTACK = [];

    /** @type {string[]} Death image paths. */
    IMAGES_DEAD = [];

    /** @type {number} Timestamp of the last successful hit. */
    lastHit = 0;

    /** @type {number} Minimum time between hits in milliseconds. */
    hitCooldown = 500;

    /** @type {boolean} Whether the hurt animation is playing. */
    isHurt = false;

    /** @type {number} Current hurt animation frame. */
    hurtImageIndex = 0;

    /** @type {boolean} Whether an attack is currently playing. */
    isAttacking = false;

    /** @type {number} Current attack animation frame. */
    attackImageIndex = 0;

    /** @type {number} Timestamp of the last melee attack. */
    lastAttackTime = 0;

    /** @type {number} Time between melee attacks in milliseconds. */
    attackCooldown = 3000;

    /** @type {boolean} Whether the current attack has hit Sharkie. */
    attackHasHit = false;

    /** @type {'melee'|'ranged'|null} Current attack type. */
    attackType = null;

    /** @type {boolean} Whether a ranged projectile is ready. */
    rangedProjectileReady = false;

    /** @type {number} Frame that releases the ranged projectile. */
    rangedReleaseFrame = 4;

    /** @type {boolean} Whether the death animation has started. */
    deathAnimationStarted = false;

    /** @type {boolean} Whether the death animation has finished. */
    deathAnimationFinished = false;

    /** @type {number} Current death animation frame. */
    deathImageIndex = 0;

    /** @type {number} Timestamp of the last death animation frame. */
    lastDeathFrameTime = 0;

    /** @type {number} Vertical movement speed. */
    verticalSpeed = 0.6;

    /** @type {number} Current vertical movement direction. */
    verticalDirection = 1;

    /** @type {number} Upper movement boundary. */
    minY = 20;

    /** @type {number} Lower movement boundary. */
    maxY = 100;

    /** @type {number} Horizontal movement speed. */
    horizontalSpeed = 0.8;

    /** @type {number} Minimum distance from Sharkie. */
    attackDistance = 250;

    /** @type {number} Left movement boundary. */
    minX = 7700;

    /** @type {number} Right movement boundary. */
    maxX = 9400;

    /** @type {number} Time between ranged attacks in milliseconds. */
    rangedAttackCooldown = 4000;

    /** @type {number} Timestamp of the last ranged attack. */
    lastRangedAttackTime = 0;

    /**
     * Initializes the boss's animation resources.
     */
    constructor() {
        super();
        this.initializeImagePaths();
        this.preloadAllImages();
        this.loadImage(this.IMAGES_INTRODUCE[0]);
    }

    /**
     * Creates the image paths for all boss animations.
     *
     * @returns {void}
     */
    initializeImagePaths() {
        const folder = 'assets/2.Enemy/3 Final Enemy/';

        this.IMAGES_INTRODUCE = this.createImagePaths(
            `${folder}1.Introduce/`, 10
        );
        this.IMAGES_FLOATING = this.createImagePaths(
            `${folder}2.floating/`, 13
        );
        this.IMAGES_HURT = this.createImagePaths(
            `${folder}Hurt/`, 4
        );
        this.IMAGES_ATTACK = this.createImagePaths(
            `${folder}Attack/`, 6
        );
        this.IMAGES_DEAD = this.createDeathImagePaths(folder);
    }

    /**
     * Creates numbered image paths.
     *
     * @param {string} folder - Image folder.
     * @param {number} count - Number of images.
     * @returns {string[]} Image paths.
     */
    createImagePaths(folder, count) {
        return Array.from(
            { length: count },
            (_, index) => `${folder}${index + 1}.png`
        );
    }

    /**
     * Creates the six original boss death image paths.
     *
     * @param {string} folder - Boss image folder.
     * @returns {string[]} Death image paths.
     */
    createDeathImagePaths(folder) {
        const deathFolder = `${folder}Dead/Mesa de trabajo 2`;

        return [
            `${deathFolder} copia 6.png`,
            `${deathFolder} copia 7.png`,
            `${deathFolder} copia 8.png`,
            `${deathFolder} copia 9.png`,
            `${deathFolder} copia 10.png`,
            `${deathFolder}.png`
        ];
    }

    /**
     * Preloads every boss animation.
     *
     * @returns {void}
     */
    preloadAllImages() {
        this.preloadAnimationImages(this.IMAGES_INTRODUCE);
        this.preloadAnimationImages(this.IMAGES_FLOATING);
        this.preloadAnimationImages(this.IMAGES_HURT);
        this.preloadAnimationImages(this.IMAGES_ATTACK);
        this.preloadAnimationImages(this.IMAGES_DEAD);
    }

    /**
     * Loads animation frames into the image cache.
     *
     * @param {string[]} paths - Image paths to preload.
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
     * Displays an image from the cache when it is loaded.
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
}
