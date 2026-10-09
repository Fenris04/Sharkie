
/**
 * Handles boss movement, combat, and projectiles.
 */
class WorldBoss extends WorldCollectibles {

    /**
     * Starts a melee attack when Sharkie is within range.
     *
     * @returns {void}
     */
    updateBossAttack() {
        if (this.gameState !== 'boss-fight') return;
        if (this.character.isDead()) return;

        const boss = this.endboss;

        if (boss.isAttacking || boss.isHurt) return;
        if (!this.isCharacterInBossAttackRange()) return;

        boss.tryAttack();
    }

    /**
     * Checks whether Sharkie is within melee attack range.
     *
     * @returns {boolean} True when Sharkie is close enough.
     */
    isCharacterInBossAttackRange() {
        const boss = this.endboss;
        const character = this.character;
        const bossCenter = boss.x + boss.width / 2;
        const characterCenter = character.x + character.width / 2;
        const distance = Math.abs(characterCenter - bossCenter);

        return distance <= boss.attackDistance + 100;
    }

    /**
     * Checks whether the boss's melee attack hits Sharkie.
     *
     * @returns {void}
     */
    checkBossAttackCollision() {
        if (this.gameState !== 'boss-fight') return;
        if (!this.endboss.isAttackActive()) return;
        if (this.character.isDead()) return;

        const attack = this.endboss.getAttackHitbox();

        if (!this.isBossAttackHittingCharacter(attack)) return;

        this.endboss.attackHasHit = true;
        this.damageCharacter(20);
    }

    /**
     * Checks whether a boss attack overlaps Sharkie.
     *
     * @param {{x: number, y: number, width: number, height: number}} attack - Attack hitbox.
     * @returns {boolean} True when the attack overlaps Sharkie.
     */
    isBossAttackHittingCharacter(attack) {
        const character = this.character;

        return attack.x < character.getRight() &&
            attack.x + attack.width > character.getLeft() &&
            attack.y < character.getBottom() &&
            attack.y + attack.height > character.getTop();
    }

    /**
     * Updates boss movement during the active fight.
     *
     * @returns {void}
     */
    updateBossMovement() {
        if (this.gameState !== 'boss-fight') return;

        this.endboss.moveVertically();
        this.endboss.moveTowardsCharacter(this.character);
    }

    /**
     * Starts ranged attacks and releases prepared projectiles.
     *
     * @returns {void}
     */
    updateBossRangedAttack() {
        if (this.gameState !== 'boss-fight') return;
        if (this.character.isDead()) return;

        const boss = this.endboss;

        if (boss.isRangedProjectileReady()) {
            this.fireBossProjectile();
            boss.markRangedProjectileFired();
            return;
        }

        if (boss.canUseRangedAttack()) {
            boss.startRangedAttack();
        }
    }

    /**
     * Creates a projectile aimed at Sharkie's current position.
     *
     * @returns {void}
     */
    fireBossProjectile() {
        const boss = this.endboss;
        const startX = boss.otherDirection
            ? boss.x + boss.width - 30
            : boss.x - 30;
        const startY = boss.y + 190;
        const targetX = this.character.x + this.character.width / 2;
        const targetY = this.character.y + this.character.height / 2;

        this.bossProjectiles.push(
            new BossProjectile(startX, startY, targetX, targetY, this)
        );
    }

    /**
     * Moves boss projectiles and removes inactive projectiles.
     *
     * @returns {void}
     */
    updateBossProjectiles() {
        this.bossProjectiles.forEach(projectile => {
            projectile.move();
            this.checkBossProjectileCollision(projectile);
        });

        this.bossProjectiles = this.bossProjectiles.filter(
            projectile => this.isBossProjectileActive(projectile)
        );
    }

    /**
     * Checks whether a boss projectile remains inside its limits.
     *
     * @param {BossProjectile} projectile - Projectile to check.
     * @returns {boolean} True when the projectile remains active.
     */
    isBossProjectileActive(projectile) {
        return !projectile.hasHit &&
            projectile.x > this.bossArenaStartX - 100 &&
            projectile.x < this.levelWidth + 100 &&
            projectile.y > -100 &&
            projectile.y < this.canvas.height + 100;
    }

    /**
     * Checks whether a boss projectile hits Sharkie.
     *
     * @param {BossProjectile} projectile - Projectile to check.
     * @returns {void}
     */
    checkBossProjectileCollision(projectile) {
        if (projectile.hasHit || this.character.isDead()) return;
        if (!this.isProjectileHittingCharacter(projectile)) return;

        projectile.hasHit = true;
        this.damageCharacter(projectile.damage);
    }

    /**
     * Checks whether a projectile overlaps Sharkie's hitbox.
     *
     * @param {BossProjectile} projectile - Projectile to check.
     * @returns {boolean} True when the projectile overlaps Sharkie.
     */
    isProjectileHittingCharacter(projectile) {
        const character = this.character;

        return projectile.x < character.getRight() &&
            projectile.x + projectile.width > character.getLeft() &&
            projectile.y < character.getBottom() &&
            projectile.y + projectile.height > character.getTop();
    }
}
