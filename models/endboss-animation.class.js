
/**
 * Handles the final boss's animations and activation.
 */
class EndbossAnimation extends EndbossBase {

    /** @type {World|null} Reference to the current game world. */
    world = null;

    /**
     * Connects the boss to its game world.
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
     * @returns {boolean} True when the boss must wait.
     */
    isWorldPaused() {
        return this.world !== null &&
            (this.world.paused || !this.world.running);
    }

    /**
     * Activates the boss when Sharkie enters the boss area.
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
        if (this.animationInterval !== null) {
            return;
        }

        this.animationInterval = setInterval(() => {
            if (this.isWorldPaused()) return;
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
     * Plays the boss introduction once.
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
     * Plays the attack animation.
     * Releases a ranged projectile on the fourth frame.
     *
     * @returns {void}
     */
    playAttackAnimation() {
        const path = this.IMAGES_ATTACK[this.attackImageIndex];

        this.showImage(path);
        this.attackImageIndex++;
        this.prepareRangedProjectile();

        if (this.attackImageIndex >= this.IMAGES_ATTACK.length) {
            this.finishAttackAnimation();
        }
    }

    /**
     * Prepares a ranged projectile on the configured attack frame.
     *
     * @returns {void}
     */
    prepareRangedProjectile() {
        if (
            this.attackType === 'ranged' &&
            this.attackImageIndex === this.rangedReleaseFrame
        ) {
            this.rangedProjectileReady = true;
        }
    }

    /**
     * Resets the boss's attack animation state.
     *
     * @returns {void}
     */
    finishAttackAnimation() {
        this.isAttacking = false;
        this.attackType = null;
        this.attackImageIndex = 0;
        this.currentImage = 0;
    }

    /**
     * Starts the boss death animation after the camera arrives.
     *
     * @returns {void}
     */
    startDeathAnimation() {
        if (this.deathAnimationStarted) {
            return;
        }

        this.deathAnimationStarted = true;
        this.deathAnimationFinished = false;
        this.deathImageIndex = 0;
        this.lastDeathFrameTime = 0;
        this.resetDeathAttackState();

        audioManager.playSound('bossDeath', 0.7);
    }

    /**
     * Clears attack states when the boss dies.
     *
     * @returns {void}
     */
    resetDeathAttackState() {
        this.isHurt = false;
        this.isAttacking = false;
        this.attackType = null;
        this.attackImageIndex = 0;
        this.rangedProjectileReady = false;
    }

    /**
     * Plays the boss death animation once.
     *
     * @returns {void}
     */
    playDeathAnimation() {
        if (this.deathAnimationFinished) return;

        const now = Date.now();
        const frameDelay = 200;

        if (now - this.lastDeathFrameTime < frameDelay) return;

        this.lastDeathFrameTime = now;
        this.advanceDeathAnimation();
    }

    /**
     * Advances the death animation by one frame.
     *
     * @returns {void}
     */
    advanceDeathAnimation() {
        if (this.deathImageIndex >= this.IMAGES_DEAD.length) {
            this.finishDeathAnimation();
            return;
        }

        const path = this.IMAGES_DEAD[this.deathImageIndex];
        this.showImage(path);
        this.deathImageIndex++;
    }

    /**
     * Finishes the death animation and keeps its final frame visible.
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
}
