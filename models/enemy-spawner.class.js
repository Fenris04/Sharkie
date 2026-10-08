/**
 * Creates enemies at random intervals near the visible game area.
 */
class EnemySpawner {
    /** @type {World} Reference to the current game world. */
    world;

    /** @type {number | null} Current spawn timeout identifier. */
    spawnTimeout = null;

    /** @type {boolean} Whether spawning is active. */
    running = false;

    /** @type {number} Maximum number of living enemies. */
    maxEnemies = 8;

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
        if (this.running) return;

        this.running = true;
        this.scheduleNextSpawn();
    }

    /**
     * Schedules the next enemy spawn.
     *
     * @returns {void}
     */
    scheduleNextSpawn() {
        if (!this.running) return;

        const delay = 500 + Math.random() * 700;

        this.spawnTimeout = setTimeout(() => {
            this.spawnEnemy();
            this.scheduleNextSpawn();
        }, delay);
    }

    /**
     * Spawns a randomly selected enemy with sufficient spacing.
     *
     * @returns {void}
     */
    spawnEnemy() {
        if (this.countLivingEnemies() >= this.maxEnemies) return;

        const x = this.getSpawnX();
        const y = this.findFreeSpawnY(x);

        if (y === null) return;

        if (this.shouldSpawnPufferFish()) {
         this.world.enemies.push(new PufferFish(x, y));
        } else {
          this.world.jellyfish.push(new JellyFish(x, y));
      }
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
     * Counts living puffer fish and jellyfish.
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
     * Stops spawning enemies and clears the pending timeout.
     *
     * @returns {void}
     */
    stop() {
        this.running = false;
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

        if (this.isSpawnPositionFree(x, y)) return y;
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
    const enemies = [...this.world.enemies, ...this.world.jellyfish];

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