
/**
 * Handles collisions between Sharkie, enemies, and attacks.
 */
class WorldCollision extends WorldRender {

    /**
     * Checks collisions with living puffer fish.
     *
     * @returns {void}
     */
    checkCollisions() {
        this.enemies.forEach(enemy => {
            if (this.canEnemyDamageCharacter(enemy)) {
                this.damageCharacter();
            }
        });
    }

    /**
     * Checks whether a puffer fish can damage Sharkie.
     *
     * @param {PufferFish} enemy - Enemy to check.
     * @returns {boolean} True when the enemy touches Sharkie.
     */
    canEnemyDamageCharacter(enemy) {
        return !enemy.isDead() &&
            this.character.isColliding(enemy);
    }

    /**
     * Checks collisions with living jellyfish.
     *
     * @returns {void}
     */
    checkJellyfishCollisions() {
        this.jellyfish.forEach(jellyfish => {
            if (
                !jellyfish.isDead() &&
                this.character.isColliding(jellyfish)
            ) {
                this.damageCharacter(20, 'electric');
            }
        });
    }

    /**
     * Applies damage and updates Sharkie's health bar.
     *
     * @param {number} damage - Damage amount.
     * @param {string} type - Damage type.
     * @returns {void}
     */
    damageCharacter(damage = 20, type = 'poison') {
        this.character.hit(damage, type);
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Checks fin-slap collisions with enemies and the boss.
     *
     * @returns {void}
     */
    checkAttackCollisions() {
        if (!this.character.canAttackEnemy()) {
            return;
        }

        this.enemies.forEach(enemy => {
            if (this.isAttackHittingEnemy(enemy)) {
                enemy.die();
            }
        });

        this.checkFinSlapBossCollision();
    }

    /**
     * Checks whether Sharkie's fin slap damages the boss.
     *
     * @returns {void}
     */
    checkFinSlapBossCollision() {
        if (this.gameState !== 'boss-fight') return;
        if (this.endboss.isDead()) return;

        const attack = this.character.getAttackHitbox();
        const boss = this.endboss;

        if (this.isOverlappingBoss(attack, boss)) {
            boss.hit(10);
        }
    }

    /**
     * Checks whether two rectangular areas overlap.
     *
     * @param {{x: number, y: number, width: number, height: number}} area - Attack area.
     * @param {{x: number, y: number, width: number, height: number}} target - Target area.
     * @returns {boolean} True when both areas overlap.
     */
    isOverlappingBoss(area, target) {
        return area.x < target.x + target.width &&
            area.x + area.width > target.x &&
            area.y < target.y + target.height &&
            area.y + area.height > target.y;
    }

    /**
     * Checks whether a fin slap hits a living puffer fish.
     *
     * @param {PufferFish} enemy - Enemy to check.
     * @returns {boolean} True when the attack hits the enemy.
     */
    isAttackHittingEnemy(enemy) {
        if (enemy.isDead()) return false;

        const attack = this.character.getAttackHitbox();

        return attack.x < enemy.getRight() &&
            attack.x + attack.width > enemy.getLeft() &&
            attack.y < enemy.getBottom() &&
            attack.y + attack.height > enemy.getTop();
    }

    /**
     * Moves bubbles and removes used or out-of-bounds bubbles.
     *
     * @returns {void}
     */
    updateBubbles() {
        this.bubbles.forEach(bubble => {
            bubble.move();
        });

        this.bubbles = this.bubbles.filter(bubble =>
            !bubble.hasHit &&
            bubble.x + bubble.width > 0 &&
            bubble.x < this.levelWidth
        );
    }

    /**
     * Checks bubble collisions with jellyfish and the boss.
     *
     * @returns {void}
     */
    checkBubbleCollisions() {
        this.bubbles.forEach(bubble => {
            this.checkBubbleJellyfishCollisions(bubble);
            this.checkBubbleBossCollision(bubble);
        });
    }

    /**
     * Checks whether a bubble hits a living jellyfish.
     *
     * @param {Bubble} bubble - Bubble projectile.
     * @returns {void}
     */
    checkBubbleJellyfishCollisions(bubble) {
        this.jellyfish.forEach(jellyfish => {
            if (bubble.hasHit || jellyfish.isDead()) {
                return;
            }

            if (bubble.isColliding(jellyfish)) {
                bubble.hasHit = true;
                jellyfish.die();
            }
        });
    }

    /**
     * Checks whether a poison bubble damages the final boss.
     *
     * @param {Bubble} bubble - Bubble projectile.
     * @returns {void}
     */
    checkBubbleBossCollision(bubble) {
        if (this.gameState !== 'boss-fight') return;
        if (bubble.hasHit || this.endboss.isDead()) return;

        if (
            this.isOverlappingBoss(bubble, this.endboss) &&
            this.endboss.hit(20)
        ) {
            bubble.hasHit = true;
        }
    }
}
