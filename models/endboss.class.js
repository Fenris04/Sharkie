
/**
 * Represents the final boss and handles combat and movement.
 */
class Endboss extends EndbossAnimation {

    /**
     * Returns the current gameplay time.
     *
     * @returns {number} Time excluding completed pauses.
     */
    getGameTime() {
        return this.world
            ? this.world.getGameTime()
            : Date.now();
    }

    /**
     * Starts a melee attack when the boss is ready.
     *
     * @returns {void}
     */
    tryAttack() {
        if (!this.canStartAttack()) return;

        this.isAttacking = true;
        this.attackType = 'melee';
        this.attackImageIndex = 0;
        this.attackHasHit = false;
        this.rangedProjectileReady = false;
        this.lastAttackTime = this.getGameTime();
    }

    /**
     * Checks whether the boss can start a melee attack.
     *
     * @returns {boolean} True when a melee attack can begin.
     */
    canStartAttack() {
        return this.activated &&
            this.introductionFinished &&
            !this.isDead() &&
            !this.isHurt &&
            !this.isAttacking &&
            !this.deathAnimationStarted &&
            this.getGameTime() - this.lastAttackTime >=
                this.attackCooldown;
    }

    /**
     * Starts a ranged attack without firing immediately.
     *
     * @returns {void}
     */
    startRangedAttack() {
        if (!this.canUseRangedAttack()) return;

        this.isAttacking = true;
        this.attackType = 'ranged';
        this.attackImageIndex = 0;
        this.attackHasHit = false;
        this.rangedProjectileReady = false;
        this.lastRangedAttackTime = this.getGameTime();
    }

    /**
     * Checks whether the boss can start a ranged attack.
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
            this.getGameTime() - this.lastRangedAttackTime >=
                this.rangedAttackCooldown;
    }

    /**
     * Checks whether a melee attack can damage Sharkie.
     *
     * @returns {boolean} True during active melee frames.
     */
    isAttackActive() {
        return this.isAttacking &&
            this.attackType === 'melee' &&
            this.attackImageIndex >= 3 &&
            this.attackImageIndex <= 5 &&
            !this.attackHasHit;
    }

    /**
     * Checks whether a ranged projectile is ready.
     *
     * @returns {boolean} True when the projectile can be spawned.
     */
    isRangedProjectileReady() {
        return this.rangedProjectileReady &&
            !this.isDead() &&
            !this.deathAnimationStarted;
    }

    /**
     * Marks the prepared ranged projectile as fired.
     *
     * @returns {void}
     */
    markRangedProjectileFired() {
        this.rangedProjectileReady = false;
    }

    /**
     * Returns the melee attack collision area.
     *
     * @returns {{x: number, y: number, width: number, height: number}}
     * The melee attack hitbox.
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
     * Applies damage and interrupts the current attack.
     *
     * @param {number} damage - Amount of damage.
     * @returns {boolean} True when damage was applied.
     */
    hit(damage) {
        if (!this.canReceiveDamage()) return false;

        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = this.getGameTime();
        this.startHurtState();

        return true;
    }

    /**
     * Activates the hurt state and cancels the current attack.
     *
     * @returns {void}
     */
    startHurtState() {
        this.isHurt = true;
        this.hurtImageIndex = 0;
        this.isAttacking = false;
        this.attackType = null;
        this.attackImageIndex = 0;
        this.rangedProjectileReady = false;
    }

    /**
     * Checks whether the boss can receive damage.
     *
     * @returns {boolean} True when damage can be applied.
     */
    canReceiveDamage() {
        return this.activated &&
            this.introductionFinished &&
            this.energy > 0 &&
            this.getGameTime() - this.lastHit >= this.hitCooldown;
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
     * Moves the boss vertically between its boundaries.
     *
     * @returns {void}
     */
    moveVertically() {
        if (this.isDead() || this.deathAnimationStarted) return;

        this.y += this.verticalSpeed * this.verticalDirection;
        this.updateVerticalDirection();
    }

    /**
     * Reverses vertical movement at the boundaries.
     *
     * @returns {void}
     */
    updateVerticalDirection() {
        if (this.y >= this.maxY) {
            this.y = this.maxY;
            this.verticalDirection = -1;
        } else if (this.y <= this.minY) {
            this.y = this.minY;
            this.verticalDirection = 1;
        }
    }

    /**
     * Moves toward Sharkie and updates the facing direction.
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
        this.moveHorizontallyTowards(distance);
    }

    /**
     * Moves toward Sharkie while respecting world boundaries.
     *
     * @param {number} distance - Distance to Sharkie's center.
     * @returns {void}
     */
    moveHorizontallyTowards(distance) {
        if (Math.abs(distance) <= this.attackDistance) return;

        this.x += Math.sign(distance) * this.horizontalSpeed;
        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
    }
}
