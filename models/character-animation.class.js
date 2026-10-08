/**
 * Handles Sharkie's animations, movement and health.
 */
class CharacterAnimation extends CharacterBase {

    /**
     * Selects the animation matching Sharkie's current state.
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playHurtAnimation();
        } else if (this.isAttacking) {
            this.playAttackAnimation();
        } else if (this.isBubbleAttacking) {
            this.playBubbleAttackAnimation();
        } else if (this.isMoving()) {
            this.playAnimation(this.swimImages);
        } else {
            this.playAnimation(this.idleImages);
        }
    }

    /**
     * Displays the next frame of a repeating animation.
     *
     * @param {HTMLImageElement[]} images - Animation frames.
     * @returns {void}
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        this.img = images[index];
        this.currentImage++;
    }

    /**
     * Plays the fin-slap animation once.
     *
     * @returns {void}
     */
    playAttackAnimation() {
        if (this.currentImage < this.attackImages.length) {
            this.img = this.attackImages[this.currentImage];
            this.currentImage++;
            return;
        }

        this.finishAttack();
    }

    /**
     * Finishes the current fin-slap attack.
     *
     * @returns {void}
     */
    finishAttack() {
        this.isAttacking = false;
        this.currentImage = 0;
    }

    /**
     * Plays the death animation matching the damage type.
     *
     * @returns {void}
     */
    playDeathAnimation() {
        if (this.deathAnimationFinished) {
            return;
        }

        const images = this.getDeathImages();

        if (this.currentImage < images.length) {
            this.img = images[this.currentImage];
            this.currentImage++;
        } else {
            this.finishDeathAnimation();
        }
    }

    /**
     * Keeps the final death animation frame visible.
     *
     * @returns {void}
     */
    finishDeathAnimation() {
        const images = this.getDeathImages();
        const lastImage = images.length - 1;

        this.img = images[lastImage];
        this.deathAnimationFinished = true;
    }

    /**
     * Moves Sharkie according to the keyboard input.
     *
     * @returns {void}
     */
    move() {
        if (this.isDead() || this.controlsLocked) {
            return;
        }

        this.moveHorizontally();
        this.moveVertically();
    }

    /**
     * Handles horizontal movement and direction.
     *
     * @returns {void}
     */
    moveHorizontally() {
        if (this.keyboard.RIGHT && this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
        }

        if (this.keyboard.LEFT && this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /**
     * Handles vertical movement.
     *
     * @returns {void}
     */
    moveVertically() {
        if (this.keyboard.UP && this.canMoveUp()) {
            this.moveUp();
        }

        if (this.keyboard.DOWN && this.canMoveDown()) {
            this.moveDown();
        }
    }

    /**
     * Checks whether a movement key is pressed.
     *
     * @returns {boolean} Whether Sharkie is moving.
     */
    isMoving() {
        if (this.controlsLocked) {
            return false;
        }

        return this.keyboard.RIGHT ||
            this.keyboard.LEFT ||
            this.keyboard.UP ||
            this.keyboard.DOWN;
    }

    /**
     * Checks whether Sharkie can move right.
     *
     * @returns {boolean} Whether movement is possible.
     */
    canMoveRight() {
        return this.x + this.width < this.world.levelWidth;
    }

    /**
     * Checks whether Sharkie can move left.
     *
     * @returns {boolean} Whether movement is possible.
     */
    canMoveLeft() {
        return this.x > 0;
    }

    /**
     * Checks whether Sharkie can move upward.
     *
     * @returns {boolean} Whether movement is possible.
     */
    canMoveUp() {
        return this.y > 0;
    }

    /**
     * Checks whether Sharkie can move downward.
     *
     * @returns {boolean} Whether movement is possible.
     */
    canMoveDown() {
        return this.y + this.height < 480;
    }

    /**
     * Reduces Sharkie's health and stores the damage type.
     *
     * @param {number} damage - Health points to remove.
     * @param {'poison'|'electric'} [type='poison'] - Damage type.
     * @returns {void}
     */
    hit(damage, type = 'poison') {
        if (!this.canReceiveDamage() || this.isDead()) {
            return;
        }

        this.energy = Math.max(0, this.energy - damage);
        this.damageType = type;
        this.lastHit = Date.now();
        this.isAttacking = false;
        this.isBubbleAttacking = false;
        this.currentImage = 0;
    }

    /**
     * Checks whether Sharkie can receive damage.
     *
     * @returns {boolean} Whether the hit cooldown has expired.
     */
    canReceiveDamage() {
        return Date.now() - this.lastHit > this.hitCooldown;
    }

    /**
     * Checks whether Sharkie is currently hurt.
     *
     * @returns {boolean} Whether Sharkie is in the hurt state.
     */
    isHurt() {
        return Date.now() - this.lastHit < this.hitCooldown;
    }

    /**
     * Checks whether Sharkie has no health remaining.
     *
     * @returns {boolean} Whether Sharkie is dead.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Checks whether the death animation has finished.
     *
     * @returns {boolean} Whether the death animation is complete.
     */
    isDeathAnimationFinished() {
        return this.isDead() && this.deathAnimationFinished;
    }

    /**
     * Stops Sharkie's animation interval.
     *
     * @returns {void}
     */
    stopIntervals() {
        clearInterval(this.animationInterval);
    }

    /**
     * Loads the electric-shock hurt animation.
     *
     * @returns {void}
     */
    loadElectricHurtImages() {
        for (let i = 1; i <= 3; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/5.Hurt/2.Electric shock/${i}.png`;
            this.electricHurtImages.push(image);
        }
    }

    /**
     * Plays the hurt animation matching the damage type.
     *
     * @returns {void}
     */
    playHurtAnimation() {
        if (this.damageType === 'electric') {
            this.playAnimation(this.electricHurtImages);
            return;
        }

        this.playAnimation(this.hurtImages);
    }

    /**
     * Loads the electric-shock death animation.
     *
     * @returns {void}
     */
    loadElectricDeadImages() {
        for (let i = 1; i <= 10; i++) {
            const image = new Image();
            image.src =
                `assets/1.Sharkie/6.dead/2.Electro_shock/${i}.png`;
            this.electricDeadImages.push(image);
        }
    }

    /**
     * Returns the death animation for the last damage type.
     *
     * @returns {HTMLImageElement[]} Matching animation frames.
     */
    getDeathImages() {
        if (this.damageType === 'electric') {
            return this.electricDeadImages;
        }

        return this.deadImages;
    }
}