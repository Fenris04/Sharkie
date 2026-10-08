/**
 * Represents the final boss and manages its animations, attacks, and health.
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

    /** @type {string[]} Attack image paths. */
    IMAGES_ATTACK = [];

    /** @type {string[]} Death image paths. */
    IMAGES_DEAD = [];

    /** @type {number} Timestamp of the last successful hit. */
    lastHit = 0;

    /** @type {number} Minimum time between successful hits in milliseconds. */
    hitCooldown = 500;

    /** @type {boolean} Whether the hurt animation is playing. */
    isHurt = false;

    /** @type {number} Current hurt animation frame. */
    hurtImageIndex = 0;

    /** @type {boolean} Whether an attack is currently playing. */
    isAttacking = false;

    /** @type {number} Current attack animation frame. */
    attackImageIndex = 0;

    /** @type {number} Timestamp of the last attack. */
    lastAttackTime = 0;

    /** @type {number} Time between attacks in milliseconds. */
    attackCooldown = 3000;

    /** @type {boolean} Whether Sharkie was already hit by the current attack. */
    attackHasHit = false;

    /** @type {boolean} Whether the death animation has started. */
    deathAnimationStarted = false;

    /** @type {boolean} Whether the death animation has finished. */
    deathAnimationFinished = false;

    /** @type {number} Current death animation frame. */
    deathImageIndex = 0;

    /** @type {number} Timestamp of the last death animation frame. */
    lastDeathFrameTime = 0;

    /** @type {number} Vertical movement speed per frame. */
verticalSpeed = 0.6;

/** @type {number} Current vertical movement direction. */
verticalDirection = 1;

/** @type {number} Upper movement boundary. */
minY = 20;

/** @type {number} Lower movement boundary. */
  maxY = 100;

  /** @type {number} Horizontal movement speed per frame. */
horizontalSpeed = 0.8;

/** @type {number} Minimum horizontal distance from Sharkie. */
attackDistance = 250;

/** @type {number} Left boundary of the boss movement area. */
minX = 7700;

/** @type {number} Right boundary of the boss movement area. */
maxX = 9400;

/** @type {number} Time between ranged attacks in milliseconds. */
rangedAttackCooldown = 4000;

/** @type {number} Timestamp of the last ranged attack. */
lastRangedAttackTime = 0;

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

        this.IMAGES_ATTACK = this.createImagePaths(
            'assets/2.Enemy/3 Final Enemy/Attack/',
            6
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
        this.preloadAnimationImages(this.IMAGES_ATTACK);
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
        } else if (this.isAttacking) {
            this.playAttackAnimation();
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
     * Starts an attack when the cooldown has elapsed.
     *
     * @returns {void}
     */
    tryAttack() {
        if (!this.canStartAttack()) return;

        this.isAttacking = true;
        this.attackImageIndex = 0;
        this.attackHasHit = false;
        this.lastAttackTime = Date.now();
    }

    /**
     * Checks whether the boss can start a new attack.
     *
     * @returns {boolean} True when another attack can begin.
     */
    canStartAttack() {
        return this.activated &&
            this.introductionFinished &&
            !this.isDead() &&
            !this.isHurt &&
            !this.isAttacking &&
            !this.deathAnimationStarted &&
            Date.now() - this.lastAttackTime >= this.attackCooldown;
    }

    /**
     * Plays the attack animation once.
     *
     * @returns {void}
     */
    playAttackAnimation() {
        const path = this.IMAGES_ATTACK[this.attackImageIndex];

        this.showImage(path);
        this.attackImageIndex++;

        if (this.attackImageIndex >= this.IMAGES_ATTACK.length) {
            this.isAttacking = false;
            this.attackImageIndex = 0;
            this.currentImage = 0;
        }
    }

    /**
     * Checks whether the boss attack is in its damaging phase.
     *
     * @returns {boolean} True while the attack can cause damage.
     */
    isAttackActive() {
        return this.isAttacking &&
            this.attackImageIndex >= 3 &&
            this.attackImageIndex <= 5 &&
            !this.attackHasHit;
    }

  /**
 * Returns the attack hitbox on the side the boss is facing.
 *
 * @returns {{x: number, y: number, width: number, height: number}}
 */
getAttackHitbox() {
    const width = 170;

    return {
        x: this.otherDirection
            ? this.x + this.width - 60
            : this.x - 110,
        y: this.y + 110,
        width: width,
        height: 180
    };
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
     * Starts the boss death animation after the camera arrives.
     *
     * @returns {void}
     */
    startDeathAnimation() {
        if (this.deathAnimationStarted) return;

        this.deathAnimationStarted = true;
        this.deathAnimationFinished = false;
        this.deathImageIndex = 0;
        this.lastDeathFrameTime = 0;
        this.isHurt = false;
        this.isAttacking = false;
    }

    /**
     * Plays the boss death animation exactly once.
     *
     * @returns {void}
     */
    playDeathAnimation() {
        if (this.deathAnimationFinished) return;

        const now = Date.now();
        const frameDelay = 200;

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
 * Moves the boss vertically between its movement boundaries.
 *
 * @returns {void}
 */
moveVertically() {
    if (this.isDead() || this.deathAnimationStarted) return;

    this.y += this.verticalSpeed * this.verticalDirection;

    if (this.y >= this.maxY) {
        this.y = this.maxY;
        this.verticalDirection = -1;
    } else if (this.y <= this.minY) {
        this.y = this.minY;
        this.verticalDirection = 1;
    }
}

/**
 * Moves toward Sharkie and updates the boss facing direction.
 *
 * @param {Character} character - The player character.
 * @returns {void}
 */
moveTowardsCharacter(character) {
    if (this.isDead() || this.deathAnimationStarted) return;

    const bossCenter = this.x + this.width / 2;
    const characterCenter = character.x + character.width / 2;
    const distance = characterCenter - bossCenter;

    this.otherDirection = distance > 0;

    if (Math.abs(distance) <= this.attackDistance) return;

    this.x += Math.sign(distance) * this.horizontalSpeed;
    this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
}

/**
 * Checks whether the boss can perform a ranged attack.
 *
 * @returns {boolean} True when a ranged attack is available.
 */
canUseRangedAttack() {
    return this.activated &&
        this.introductionFinished &&
        !this.isDead() &&
        !this.isHurt &&
        !this.isAttacking &&
        !this.deathAnimationStarted &&
        Date.now() - this.lastRangedAttackTime >=
            this.rangedAttackCooldown;
}

}