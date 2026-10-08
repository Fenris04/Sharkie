
/**
 * Manages collectibles and removes inactive enemies.
 */
class WorldCollectibles extends WorldCollision {

    /**
     * Checks whether Sharkie touches collectible coins.
     *
     * @returns {void}
     */
    checkCoinCollisions() {
        this.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                this.collectCoin(coin);
            }
        });

        this.coins = this.coins.filter(coin => !coin.collected);
    }

    /**
     * Collects a coin and updates the coin status bar.
     *
     * @param {Coin} coin - Coin to collect.
     * @returns {void}
     */
    collectCoin(coin) {
        if (coin.collected || this.character.isDead()) {
            return;
        }

        coin.collect();
        this.collectedCoins++;

        const percentage = this.collectedCoins / this.totalCoins * 100;
        this.coinStatusBar.setPercentage(percentage);
    }

    /**
     * Checks collisions with collectible poison bottles.
     *
     * @returns {void}
     */
    checkPoisonBottleCollisions() {
        this.poisonBottles.forEach(bottle => {
            if (this.canCollectPoisonBottle(bottle)) {
                this.collectPoisonBottle(bottle);
            }
        });

        this.poisonBottles = this.poisonBottles.filter(
            bottle => !bottle.collected
        );
    }

    /**
     * Checks whether Sharkie can collect a poison bottle.
     *
     * @param {PoisonBottle} bottle - Bottle to check.
     * @returns {boolean} True when the bottle can be collected.
     */
    canCollectPoisonBottle(bottle) {
        return !bottle.collected &&
            !this.character.isDead() &&
            this.character.poison < this.character.maxPoison &&
            this.character.isColliding(bottle);
    }

    /**
     * Collects a poison bottle and restores ammunition.
     *
     * @param {PoisonBottle} bottle - Bottle to collect.
     * @returns {void}
     */
    collectPoisonBottle(bottle) {
        if (bottle.collected) {
            return;
        }

        bottle.collect();

        this.character.poison = Math.min(
            this.character.maxPoison,
            this.character.poison + 1
        );
    }

    /**
     * Synchronizes the poison bar with Sharkie's ammunition.
     *
     * @returns {void}
     */
    updatePoisonStatusBar() {
        const percentage =
            (this.character.poison / this.character.maxPoison) * 100;

        this.poisonStatusBar.setPercentage(percentage);
    }

    /**
     * Removes defeated puffer fish below the canvas.
     *
     * @returns {void}
     */
    removeDefeatedEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            if (!enemy.isDead() || enemy.y < 480) {
                return true;
            }

            enemy.stopIntervals();
            return false;
        });
    }

    /**
     * Removes jellyfish after their death animations finish.
     *
     * @returns {void}
     */
    removeDefeatedJellyfish() {
        this.jellyfish = this.jellyfish.filter(jellyfish => {
            if (!jellyfish.isDeathAnimationFinished()) {
                return true;
            }

            jellyfish.stopIntervals();
            return false;
        });
    }

    /**
     * Removes enemies that are far behind the camera.
     *
     * @returns {void}
     */
    removeOffscreenEnemies() {
        this.enemies = this.enemies.filter(enemy =>
            this.keepEnemyInWorld(enemy)
        );

        this.jellyfish = this.jellyfish.filter(jellyfish =>
            this.keepEnemyInWorld(jellyfish)
        );
    }

    /**
     * Checks whether an enemy should remain in the world.
     *
     * @param {MovableObject} enemy - Enemy to check.
     * @returns {boolean} True when the enemy should remain.
     */
    keepEnemyInWorld(enemy) {
        if (enemy.isDead()) {
            return true;
        }

        const visibleLeft = -this.cameraX;
        const removalX = Math.max(0, visibleLeft - 100);

        if (enemy.x + enemy.width >= removalX) {
            return true;
        }

        enemy.stopIntervals();
        return false;
    }
}
