
/**
 * Coordinates the main game loop and game lifecycle.
 */
class World extends WorldBossPoison {

    /**
     * Runs the main game loop.
     *
     * @returns {void}
     */
    draw() {
        if (!this.running) return;

        if (!this.paused) {
            this.clearCanvas();
            this.update();
            this.drawGameWorld();
        }

        requestAnimationFrame(() => this.draw());
    }

    /**
    * Updates the current game frame.
    *
    * @returns {void}
    */
    update() {
        if (!this.running || this.paused) return;

        if (this.isBossCutsceneActive()) {
            this.updateBossCutscene();
            return;
        }

        this.character.move();

        if (this.shouldStartBossCutscene()) {
            this.startBossCutscene();
            return;
        }

        this.updateWorldInteractions();

        if (this.shouldStartBossDeathCutscene()) {
            this.startBossDeathCutscene();
            return;
        }

        this.updateBossCombat();
        this.updateWorldProgress();
    }

    /**
     * Checks whether the boss introduction should begin.
     *
     * @returns {boolean} True when the introduction should start.
     */
    shouldStartBossCutscene() {
        return this.gameState === 'playing' &&
            !this.character.isDead() &&
            this.character.x >= this.endboss.activationX;
    }

    /**
     * Updates arena boundaries, projectiles, and collisions.
     *
     * @returns {void}
     */
    updateWorldInteractions() {
        this.updateBossArena();
        this.keepCharacterInsideBossArena();
        this.updateBubbles();
        this.updateBossPoisonSpawning();
        this.checkCollisions();
        this.checkJellyfishCollisions();
        this.checkAttackCollisions();
        this.checkBubbleCollisions();
    }

    /**
     * Checks whether the boss death sequence should begin.
     *
     * @returns {boolean} True when the boss has been defeated.
     */
    shouldStartBossDeathCutscene() {
        return this.gameState === 'boss-fight' &&
            this.endboss.isDead();
    }

    /**
     * Updates boss movement, attacks, and projectiles.
     *
     * @returns {void}
     */
    updateBossCombat() {
        this.updateBossMovement();
        this.updateBossRangedAttack();
        this.updateBossAttack();
        this.checkBossAttackCollision();
        this.updateBossProjectiles();
    }

    /**
     * Updates collectibles, enemies, camera, and game over.
     *
     * @returns {void}
     */
    updateWorldProgress() {
        this.checkCoinCollisions();
        this.checkPoisonBottleCollisions();
        this.removeDefeatedEnemies();
        this.removeDefeatedJellyfish();
        this.removeOffscreenEnemies();
        this.updateCamera();
        this.checkGameOver();
    }

    /**
     * Checks whether Sharkie's death animation has finished.
     *
     * @returns {void}
     */
    checkGameOver() {
        if (!this.character.isDeathAnimationFinished()) return;

        this.showGameOverScreen();
    }

    /**
     * Displays the game-over screen once.
     *
     * @returns {void}
     */
    showGameOverScreen() {
        if (this.gameOver) return;

        this.gameOver = true;
        this.enemySpawner.stop();

        document.getElementById('game-over-screen')
            .classList.add('visible');
    }

    /**
    * Pauses gameplay and enemy spawning.
    *
    * @returns {void}
    */
    pause() {
        if (!this.running || this.gameOver || this.paused) return;

        this.pauseStartedAt = Date.now();
        this.paused = true;
        this.enemySpawner.pause();
    }

    /**
    * Resumes gameplay and enemy spawning.
    *
    * @returns {void}
    */
    resume() {
        if (!this.running || !this.paused) return;

        this.totalPausedTime += Date.now() - this.pauseStartedAt;
        this.paused = false;
        this.pauseStartedAt = 0;
        this.enemySpawner.resume();
    }

    /**
    * Stops the game and all active animation intervals.
    *
    * @returns {void}
    */
    stop() {
        if (!this.running) return;

        this.running = false;
        this.enemySpawner.stop();
        this.endboss.stopIntervals();
        this.character.stopIntervals();
        this.stopEnemyIntervals();
        this.stopJellyfishIntervals();
        this.stopCoinIntervals();
        this.stopPoisonBottleIntervals();
    }

    /**
     * Stops all puffer fish animation intervals.
     *
     * @returns {void}
     */
    stopEnemyIntervals() {
        this.enemies.forEach(enemy => enemy.stopIntervals());
    }

    /**
     * Stops all jellyfish animation intervals.
     *
     * @returns {void}
     */
    stopJellyfishIntervals() {
        this.jellyfish.forEach(jellyfish => {
            jellyfish.stopIntervals();
        });
    }

    /**
     * Stops all remaining coin animation intervals.
     *
     * @returns {void}
     */
    stopCoinIntervals() {
        this.coins.forEach(coin => coin.stopIntervals());
    }

    /**
     * Stops all remaining poison bottle animations.
     *
     * @returns {void}
     */
    stopPoisonBottleIntervals() {
        this.poisonBottles.forEach(bottle => {
            bottle.stopIntervals();
        });
    }
}
