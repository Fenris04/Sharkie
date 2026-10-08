
/**
 * Manages poison bottle spawning during the boss fight.
 */
class WorldBossPoison extends WorldBossCutscene {

    /**
     * Checks whether a poison bottle should spawn.
     *
     * @returns {void}
     */
    updateBossPoisonSpawning() {
        if (this.gameState !== 'boss-fight') return;

        const now = Date.now();

        if (this.lastBossPoisonSpawn === 0) {
            this.lastBossPoisonSpawn = now;
            return;
        }

        if (!this.isBossPoisonSpawnDue(now)) return;

        this.lastBossPoisonSpawn = now;
        this.spawnBossPoisonBottle();
    }

    /**
     * Checks whether the spawn interval has elapsed.
     *
     * @param {number} now - Current timestamp.
     * @returns {boolean} True when spawning is due.
     */
    isBossPoisonSpawnDue(now) {
        return now - this.lastBossPoisonSpawn >=
            this.bossPoisonSpawnInterval;
    }

    /**
     * Creates a poison bottle at a random arena position.
     *
     * @returns {void}
     */
    spawnBossPoisonBottle() {
        this.removeCollectedBossPoisonBottles();

        if (
            this.bossPoisonBottles.length >=
            this.maxBossPoisonBottles
        ) {
            return;
        }

        const bottle = this.createBossPoisonBottle();

        this.poisonBottles.push(bottle);
        this.bossPoisonBottles.push(bottle);
    }

    /**
     * Creates a poison bottle inside the boss arena.
     *
     * @returns {PoisonBottle} Newly created poison bottle.
     */
    createBossPoisonBottle() {
        const minX = this.bossArenaStartX + 250;
        const maxX = this.endboss.x - 150;

        const x = minX + Math.random() * (maxX - minX);
        const y = 100 + Math.random() * 250;

        return new PoisonBottle(x, y);
    }

    /**
     * Removes collected bottles from boss spawn tracking.
     *
     * @returns {void}
     */
    removeCollectedBossPoisonBottles() {
        this.bossPoisonBottles =
            this.bossPoisonBottles.filter(
                bottle => !bottle.collected
            );
    }

    /**
     * Starts the poison spawn timer when the boss fight begins.
     *
     * @returns {void}
     */
    startBossPoisonSpawning() {
        this.lastBossPoisonSpawn = Date.now();
    }
}
