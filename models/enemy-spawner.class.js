
/**
 * Creates enemies at random intervals near the visible game area.
 */
class EnemySpawner {
    /** @type {World} Reference to the current game world. */
    world;

    /** @type {number|null} Current spawn timeout identifier. */
    spawnTimeout = null;

    /** @type {boolean} Whether spawning is active. */
    running = false;

    /** @type {boolean} Whether spawning is paused. */
    paused = false;

    /** @type {number} Maximum number of living enemies. */
    maxEnemies = 8;

    /** @type {number} Character position at which spawning stops. */
    bossAreaStartX = 7000;

    /** @type {number} First world position reserved for the boss area. */
    bossSpawnLimitX = 7500;

    /**
     * Creates an enemy spawner.
     *
     * @param {World} world - The game world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Starts spawning enemies at random intervals.
     *
     * @returns {void}
     */
    start() {
        if (this.running || this.hasReachedBossArea()) return;

        this.running = true;
        this.paused = false;
        this.scheduleNextSpawn();
    }

    /**
     * Schedules the next enemy spawn.
     *
     * @returns {void}
     */
    scheduleNextSpawn() {
        if (!this.running || this.paused) return;

        if (this.hasReachedBossArea()) {
            this.stop();
            return;
        }

        const delay = 500 + Math.random() * 700;

        this.spawnTimeout = setTimeout(
            () => this.handleScheduledSpawn(),
            delay
        );
    }

    /**
     * Handles a scheduled spawn and schedules the next one.
     *
     * @returns {void}
     */
    handleScheduledSpawn() {
        this.spawnTimeout = null;

        if (!this.running || this.paused || this.world.paused) {
            return;
        }

        if (this.hasReachedBossArea()) {
            this.stop();
            return;
        }

        this.spawnEnemy();
        this.scheduleNextSpawn();
    }

    /**
     * Spawns a randomly selected enemy with sufficient spacing.
     *
     * @returns {void}
     */
    spawnEnemy() {
        if (this.paused || this.world.paused) return;

        if (this.hasReachedBossArea()) {
            this.stop();
            return;
        }

        if (this.countLivingEnemies() >= this.maxEnemies) return;

        const x = this.getSpawnX();

        if (x >= this.bossSpawnLimitX) {
            this.stop();
            return;
        }

        this.spawnEnemyAtPosition(x);
    }

    /**
     * Creates an enemy at an available vertical position.
     *
     * @param {number} x - Horizontal spawn position.
     * @returns {void}
     */
    spawnEnemyAtPosition(x) {
        const y = this.findFreeSpawnY(x);

        if (y === null) return;

        if (this.shouldSpawnPufferFish()) {
            this.world.enemies.push(new PufferFish(x, y));
        } else {
            this.world.jellyfish.push(new JellyFish(x, y));
        }
    }

    /**
     * Checks whether Sharkie has reached the boss area.
     *
     * @returns {boolean} True when normal enemy spawning must stop.
     */
    hasReachedBossArea() {
        return this.world.character.x >= this.bossAreaStartX;
    }

    /**
     * Calculates a position just outside the right canvas edge.
     *
     * @returns {number} Horizontal world position.
     */
    getSpawnX() {
        const visibleRight =
            -this.world.cameraX + this.world.canvas.width;

        return Math.min(
            visibleRight + 10,
            this.world.levelWidth - 110
        );
    }

    /**
     * Counts living puffer fish and jellyfish near the visible area.
     *
     * @returns {number} Number of living enemies.
     */
    countLivingEnemies() {
        const visibleLeft = -this.world.cameraX;
        const visibleRight = visibleLeft + this.world.canvas.width;

        const enemies = [
            ...this.world.enemies,
            ...this.world.jellyfish
        ];

        return enemies.filter(enemy =>
            !enemy.isDead() &&
            enemy.x + enemy.width > visibleLeft - 150 &&
            enemy.x < visibleRight + 150
        ).length;
    }

    /**
     * Pauses enemy spawning and clears the pending timeout.
     *
     * @returns {void}
     */
    pause() {
        if (!this.running || this.paused) return;

        this.paused = true;
        clearTimeout(this.spawnTimeout);
        this.spawnTimeout = null;
    }

    /**
     * Resumes spawning without creating duplicate timers.
     *
     * @returns {void}
     */
    resume() {
        if (!this.running || !this.paused) return;

        this.paused = false;
        this.scheduleNextSpawn();
    }

    /**
     * Stops spawning enemies and clears the pending timeout.
     *
     * @returns {void}
     */
    stop() {
        this.running = false;
        this.paused = false;
        clearTimeout(this.spawnTimeout);
        this.spawnTimeout = null;
    }

    /**
     * Finds a vertical spawn position without nearby enemies.
     *
     * @param {number} x - Horizontal spawn position.
     * @returns {number|null} Available vertical position or null.
     */
    findFreeSpawnY(x) {
        for (let attempt = 0; attempt < 12; attempt++) {
            const y = 40 + Math.random() * 300;

            if (this.isSpawnPositionFree(x, y)) {
                return y;
            }
        }

        return null;
    }

    /**
     * Checks whether a spawn position has enough distance from enemies.
     *
     * @param {number} x - Horizontal spawn position.
     * @param {number} y - Vertical spawn position.
     * @returns {boolean} True when the position is free.
     */
    isSpawnPositionFree(x, y) {
        const enemies = [
            ...this.world.enemies,
            ...this.world.jellyfish
        ];

        return enemies.every(enemy =>
            enemy.isDead() ||
            Math.abs(enemy.x - x) > 170 ||
            Math.abs(enemy.y - y) > 140
        );
    }

    /**
     * Randomly selects a puffer fish with a slightly higher probability.
     *
     * @returns {boolean} True when a puffer fish should spawn.
     */
    shouldSpawnPufferFish() {
        return Math.random() < 0.6;
    }
}
