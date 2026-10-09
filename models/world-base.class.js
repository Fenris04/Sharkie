
/**
 * Defines the game world's initial state and resources.
 */
class WorldBase {

    /** @type {HTMLCanvasElement} Game canvas. */
    canvas;

    /** @type {CanvasRenderingContext2D} Drawing context. */
    ctx;

    /** @type {Character} Player character. */
    character;

    /** @type {number} Total width of the game world. */
    levelWidth = 10800;

    /** @type {number} Horizontal camera offset. */
    cameraX = 0;

    /** @type {number} Left boundary of the boss arena. */
    bossArenaStartX = 7200;

    /** @type {boolean} Whether the boss arena is locked. */
    bossArenaLocked = false;

    /** @type {BackgroundObject[]} Background images. */
    backgrounds = Array.from(
        { length: 15 },
        (_, index) => new BackgroundObject(
            'assets/3. Background/Light/full.png',
            index * 720
        )
    );

    /** @type {PufferFish[]} Active puffer fish. */
    enemies = [];

    /** @type {JellyFish[]} Active jellyfish. */
    jellyfish = [];

    /** @type {Bubble[]} Active bubble projectiles. */
    bubbles = [];

    /** @type {Coin[]} Collectible coins. */
    coins = [
        new Coin(450, 180),
        new Coin(750, 280),
        new Coin(1100, 120),
        new Coin(1550, 300),
        new Coin(2000, 180),
        new Coin(2450, 250),
        new Coin(2900, 130),
        new Coin(3350, 300),
        new Coin(3800, 180),
        new Coin(4250, 250),
        new Coin(4700, 120),
        new Coin(5150, 300),
        new Coin(5600, 180),
        new Coin(6050, 250),
        new Coin(6500, 130),
        new Coin(6950, 300),
        new Coin(7400, 180),
        new Coin(7850, 250),
        new Coin(8300, 150)
    ];

    /** @type {number} Number of collected coins. */
    collectedCoins = 0;

    /** @type {StatusBar} Sharkie's health bar. */
    statusBar = new StatusBar();

    /** @type {EnemySpawner} Random enemy generator. */
    enemySpawner;

    /** @type {boolean} Whether game over is active. */
    gameOver = false;

    /** @type {boolean} Whether the game loop is running. */
    running = true;

    /** @type {boolean} Whether gameplay is temporarily paused. */
    paused = false;

    /** @type {number} Timestamp when the current pause started. */
    pauseStartedAt = 0;

    /** @type {number} Total duration of completed pauses. */
    totalPausedTime = 0;

    /** @type {number} Total number of collectible coins. */
    totalCoins = 19;

    /** @type {CoinStatusBar} Coin progress bar. */
    coinStatusBar = new CoinStatusBar();

    /** @type {PoisonBottle[]} Collectible poison bottles. */
    poisonBottles = [
        new PoisonBottle(600, 250),
        new PoisonBottle(1400, 150),
        new PoisonBottle(2200, 300),
        new PoisonBottle(3000, 180),
        new PoisonBottle(3800, 280),
        new PoisonBottle(4600, 120),
        new PoisonBottle(5400, 250),
        new PoisonBottle(6200, 160),
        new PoisonBottle(7000, 300),
        new PoisonBottle(7900, 180)
    ];

    /** @type {PoisonStatusBar} Poison ammunition bar. */
    poisonStatusBar = new PoisonStatusBar();

    /** @type {Endboss} Final boss. */
    endboss = new Endboss();

    /**
     * Current game phase.
     *
     * @type {'playing'|'boss-pan'|'boss-intro'|'boss-return'|'boss-fight'|'boss-death-pan'|'boss-death'|'won'}
     */
    gameState = 'playing';

    /** @type {number} Boss poison spawn interval in milliseconds. */
    bossPoisonSpawnInterval = 8000;

    /** @type {number} Timestamp of the last boss poison spawn. */
    lastBossPoisonSpawn = 0;

    /** @type {number} Maximum spawned boss arena poison bottles. */
    maxBossPoisonBottles = 3;

    /** @type {PoisonBottle[]} Boss arena poison bottles. */
    bossPoisonBottles = [];

    /** @type {number} Cutscene camera speed. */
    cutsceneCameraSpeed = 12;

    /** @type {number} Camera arrival tolerance. */
    cameraArrivalTolerance = 12;

    /** @type {BossProjectile[]} Active boss projectiles. */
    bossProjectiles = [];

    /**
     * Creates a game world and starts its systems.
     *
     * @param {HTMLCanvasElement} canvas - Game canvas.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.character = new Character(keyboard, this);
        this.endboss.setWorld(this);
        this.coins.forEach(coin => coin.setWorld(this));
        this.poisonBottles.forEach(bottle => bottle.setWorld(this));
        this.enemySpawner = new EnemySpawner(this);
        this.enemySpawner.start();
        this.draw();
    }

    /**
     * Returns gameplay time excluding all paused durations.
     *
     * @returns {number} Current gameplay timestamp in milliseconds.
     */
    getGameTime() {
        const now = this.paused ? this.pauseStartedAt : Date.now();
        return now - this.totalPausedTime;
    }
}
