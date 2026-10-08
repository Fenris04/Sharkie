
/**
 * Manages the game world, enemies, collectibles, and game state.
 */
class World {
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

   /**
    * Background images covering the entire level.
    *
    * @type {BackgroundObject[]}
    */
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

    /** @type {Coin[]} Collectible coins in the level. */
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

    /** @type {boolean} Whether the game-over screen is visible. */
    gameOver = false;

    /** @type {boolean} Whether the game loop is running. */
    running = true;

    /** @type {number} Total number of coins in the level. */
    totalCoins = 19;

    /** @type {CoinStatusBar} Coin collection progress bar. */
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

    /** @type {PoisonStatusBar} Bubble ammunition status bar. */
    poisonStatusBar = new PoisonStatusBar();    

    /** @type {Endboss} */
    endboss = new Endboss();

    /**
    * Current phase of the game and boss cutscenes.
    *
    * @type {'playing'|'boss-pan'|'boss-intro'|'boss-return'|'boss-fight'|'boss-death-pan'|'boss-death'|'won'}
    */
    gameState = 'playing';

    /** @type {number} Time between poison bottle spawns in milliseconds. */
    bossPoisonSpawnInterval = 8000;

    /** @type {number} Timestamp of the last boss arena poison spawn. */
    lastBossPoisonSpawn = 0;

    /** @type {number} Maximum number of spawned poison bottles in the arena. */
    maxBossPoisonBottles = 3;

    /** @type {PoisonBottle[]} Poison bottles spawned during the boss fight. */
    bossPoisonBottles = [];

    /** @type {number} Camera movement speed in pixels per frame. */
    cutsceneCameraSpeed = 12;

    /** @type {number} Distance at which the camera has reached its target. */
    cameraArrivalTolerance = 12;

    /** @type {BossProjectile[]} Active boss projectiles. */
bossProjectiles = [];

    /**
     * Creates a new game world.
     *
     * @param {HTMLCanvasElement} canvas - Game canvas.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.character = new Character(keyboard, this);
        this.enemySpawner = new EnemySpawner(this);

        this.enemySpawner.start();
        this.draw();
    }

    /**
     * Runs the main game loop.
     *
     * @returns {void}
     */
    draw() {
        if (!this.running) return;

        this.clearCanvas();
        this.update();
        this.drawGameWorld();

        requestAnimationFrame(() => this.draw());
    }

    /**
    * Updates movement, collisions, collectibles, and the boss cutscene.
    *
    * @returns {void}
    */
    update() {
        if (this.isBossCutsceneActive()) {
            this.updateBossCutscene();
            return;
        }

        this.character.move();

        if (
            this.gameState === 'playing' &&
            !this.character.isDead() &&
            this.character.x >= this.endboss.activationX
        ) {
            this.startBossCutscene();
            return;
        }

        this.updateBossArena();
        this.keepCharacterInsideBossArena();

        this.updateBubbles();
        this.updateBossPoisonSpawning();
        this.checkCollisions();
        this.checkJellyfishCollisions();
        this.checkAttackCollisions();
        this.checkBubbleCollisions();
        if (this.gameState === 'boss-fight' && this.endboss.isDead()) {
            this.startBossDeathCutscene();
            return;
        }

        this.updateBossMovement();
this.updateBossRangedAttack();
this.updateBossAttack();
this.checkBossAttackCollision();
this.updateBossProjectiles();
        this.checkCoinCollisions();
        this.checkPoisonBottleCollisions();
        this.removeDefeatedEnemies();
        this.removeDefeatedJellyfish();
        this.removeOffscreenEnemies();
        this.updateCamera();
        this.checkGameOver();
    }

    /**
     * Clears the visible canvas.
     *
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the world and fixed screen elements.
     *
     * @returns {void}
     */
    drawGameWorld() {
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawWorldObjects();
        this.ctx.restore();

        this.statusBar.draw(this.ctx);
        this.coinStatusBar.draw(this.ctx);
        this.drawCoinCounter();
        this.updatePoisonStatusBar();
        this.poisonStatusBar.draw(this.ctx);
        this.drawBossHealth();
    }

    /**
     * Draws objects inside the scrolling game world.
     *
     * @returns {void}
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.backgrounds);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.jellyfish);
        this.addObjectsToMap(this.bubbles);
        this.drawEndboss();
        this.character.draw(this.ctx);
        this.drawHitboxes();
        this.addObjectsToMap(this.poisonBottles);
        this.addObjectsToMap(this.bossProjectiles);
    }

    /**
     * Draws collision hitboxes for debugging.
     *
     * @returns {void}
     */
    drawHitboxes() {
        this.character.drawHitbox(this.ctx);
        this.enemies.forEach(enemy => enemy.drawHitbox(this.ctx));
        this.jellyfish.forEach(jellyfish => jellyfish.drawHitbox(this.ctx));
    }

    /**
     * Draws all objects in an array.
     *
     * @param {DrawableObject[]} objects - Objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(object => object.draw(this.ctx));
    }

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
     * Checks whether a puffer fish touches Sharkie.
     *
     * @param {PufferFish} enemy - Enemy to check.
     * @returns {boolean} True when the enemy can damage Sharkie.
     */
    canEnemyDamageCharacter(enemy) {
        return !enemy.isDead() && this.character.isColliding(enemy);
    }

    /**
     * Checks collisions with living jellyfish.
     *
     * @returns {void}
     */
    checkJellyfishCollisions() {
        this.jellyfish.forEach(jellyfish => {
            if (!jellyfish.isDead() &&
                this.character.isColliding(jellyfish)) {
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
     * Checks fin-slap collisions against puffer fish.
     *
     * @returns {void}
     */
    checkAttackCollisions() {
        if (!this.character.canAttackEnemy()) return;

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

        const isHitting =
            attack.x < boss.x + boss.width &&
            attack.x + attack.width > boss.x &&
            attack.y < boss.y + boss.height &&
            attack.y + attack.height > boss.y;

        if (isHitting) {
            boss.hit(10);
        }
    }

    /**
     * Checks whether Sharkie's fin slap hits a puffer fish.
     *
     * @param {PufferFish} enemy - Enemy to check.
     * @returns {boolean} True when the attack overlaps the enemy.
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
     * Moves bubbles and removes used or out-of-bounds projectiles.
     *
     * @returns {void}
     */
    updateBubbles() {
        this.bubbles.forEach(bubble => bubble.move());

        this.bubbles = this.bubbles.filter(bubble =>
            !bubble.hasHit &&
            bubble.x + bubble.width > 0 &&
            bubble.x < this.levelWidth
        );
    }

    /**
     * Checks bubble collisions against living jellyfish.
     *
     * @returns {void}
     */
    checkBubbleCollisions() {
       this.bubbles.forEach(bubble => {
            this.jellyfish.forEach(jellyfish => {
                if (bubble.hasHit || jellyfish.isDead()) return;

                if (bubble.isColliding(jellyfish)) {
                    bubble.hasHit = true;
                    jellyfish.die();
                }
            });

            this.checkBubbleBossCollision(bubble);
        });
    }

    /**
    * Checks whether a poison bubble damages the final boss.
    *
    * @param {Bubble} bubble - Bubble projectile to check.
    * @returns {void}
    */
    checkBubbleBossCollision(bubble) {
        if (this.gameState !== 'boss-fight') return;
        if (bubble.hasHit || this.endboss.isDead()) return;

        const boss = this.endboss;

        const isHitting =
            bubble.x < boss.x + boss.width &&
            bubble.x + bubble.width > boss.x &&
            bubble.y < boss.y + boss.height &&
            bubble.y + bubble.height > boss.y;

        if (isHitting && boss.hit(20)) {
            bubble.hasHit = true;
        }
    }

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
     * Collects a coin and increases the coin counter.
     *
     * @param {Coin} coin - Coin to collect.
     * @returns {void}
     */
    collectCoin(coin) {
        if (coin.collected || this.character.isDead()) return;

        coin.collect();
        this.collectedCoins++;

        const percentage = this.collectedCoins / this.totalCoins * 100;
        this.coinStatusBar.setPercentage(percentage);
    }

    /**
     * Removes puffer fish after they fall below the canvas.
     *
     * @returns {void}
     */
    removeDefeatedEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            if (!enemy.isDead() || enemy.y < 480) return true;

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
            if (!jellyfish.isDeathAnimationFinished()) return true;

            jellyfish.stopIntervals();
            return false;
        });
    }

    /**
     * Removes enemies that have moved far behind the camera.
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
     * Checks whether an enemy should remain active.
     *
     * @param {MovableObject} enemy - Enemy to check.
     * @returns {boolean} True when the enemy should remain.
     */
    keepEnemyInWorld(enemy) {
        if (enemy.isDead()) return true;

        const visibleLeft = -this.cameraX;
        const removalX = Math.max(0, visibleLeft - 100);

        if (enemy.x + enemy.width >= removalX) return true;

        enemy.stopIntervals();
        return false;
    }

    /**
    * Follows Sharkie while respecting world and boss arena boundaries.
    *
    * @returns {void}
    */
    updateCamera() {
        const desiredCameraX = -this.character.x + 150;

        this.cameraX = this.clampCameraX(desiredCameraX);
    }

    /**
     * Draws the collected coin count on the canvas.
     *
     * @returns {void}
     */
    drawCoinCounter() {
        this.ctx.save();

        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = '#176A87';
        this.ctx.lineWidth = 3;
        this.ctx.textBaseline = 'middle';

        const text = `${this.collectedCoins} / ${this.totalCoins}`;

        this.ctx.strokeText(text, 225, 105);
        this.ctx.fillText(text, 225, 105);

        this.ctx.restore();
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
     * Stops the game and all active timers.
     *
     * @returns {void}
     */
    stop() {
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
     * Stops all puffer fish intervals.
     *
     * @returns {void}
     */
    stopEnemyIntervals() {
        this.enemies.forEach(enemy => enemy.stopIntervals());
    }

    /**
     * Stops all jellyfish intervals.
     *
     * @returns {void}
     */
    stopJellyfishIntervals() {
        this.jellyfish.forEach(jellyfish => jellyfish.stopIntervals());
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
    * Draws the remaining bubble ammunition.
    *
    * @returns {void}
    */
    drawPoisonCounter() {
        this.ctx.save();
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = '#176A87';
        this.ctx.lineWidth = 3;

        const text = `Poison: ${this.character.poison}`;
        this.ctx.strokeText(text, 25, 150);
        this.ctx.fillText(text, 25, 150);

        this.ctx.restore();
    }

    /**
    * Collects poison bottles only when Sharkie needs ammunition.
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
    * Collects a bottle and restores one bubble ammunition charge.
    *
    * @param {PoisonBottle} bottle - Bottle to collect.
    * @returns {void}
    */
    collectPoisonBottle(bottle) {
        if (bottle.collected) return;

        bottle.collect();
        this.character.poison = Math.min(
            this.character.maxPoison,
            this.character.poison + 1
        );
    }

    /**
    * Stops all remaining poison bottle animations.
    *
    * @returns {void}
    */
    stopPoisonBottleIntervals() {
        this.poisonBottles.forEach(bottle => bottle.stopIntervals());
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
    * Locks the boss arena after the final boss is activated.
    *
    * @returns {void}
    */
    updateBossArena() {
        if (this.endboss.activated && !this.bossArenaLocked) {
            this.bossArenaLocked = true;
            this.enemySpawner.stop();
        }
    }

    /**
    * Prevents Sharkie from leaving the locked boss arena.
    *
    * @returns {void}
    */
    keepCharacterInsideBossArena() {
        if (!this.bossArenaLocked) return;

        this.character.x = Math.max(
            this.bossArenaStartX,
            this.character.x
        );
    }

    /**
 * Checks whether the boss introduction is currently running.
 *
 * @returns {boolean} True during the boss cutscene.
 */
isBossCutsceneActive() {
    return this.gameState === 'boss-pan' ||
        this.gameState === 'boss-intro' ||
        this.gameState === 'boss-return' ||
        this.gameState === 'boss-death-pan' ||
        this.gameState === 'boss-death' ||
        this.gameState === 'won';
}

/**
 * Locks Sharkie's controls and starts the boss camera sequence.
 *
 * @returns {void}
 */
startBossCutscene() {
    this.gameState = 'boss-pan';
    this.bossArenaLocked = true;

    this.enemySpawner.stop();

    this.character.controlsLocked = true;
    this.character.isAttacking = false;
    this.character.isBubbleAttacking = false;
    this.character.currentImage = 0;

    this.character.attackKeyLocked = true;
    this.character.bubbleKeyLocked = true;
}

/**
 * Updates the current phase of the boss introduction.
 *
 * @returns {void}
 */
updateBossCutscene() {
    if (this.gameState === 'boss-pan') {
        this.panCameraToBoss();
    } else if (this.gameState === 'boss-intro') {
        this.waitForBossIntroduction();
    } else if (this.gameState === 'boss-return') {
        this.returnCameraToCharacter();
    } else if (this.gameState === 'boss-death-pan') {
        this.panCameraToDeadBoss();
    } else if (this.gameState === 'boss-death') {
        this.waitForBossDeath();
    }
}

/**
 * Moves the camera toward the boss before activating the introduction.
 *
 * @returns {void}
 */
panCameraToBoss() {
    const bossCenter = this.endboss.x + this.endboss.width / 2;

    const targetX = this.clampCameraX(
        this.canvas.width / 2 - bossCenter
    );

    this.moveCameraTowards(targetX);

    if (this.hasCameraReached(targetX)) {
        this.gameState = 'boss-intro';

        this.endboss.checkActivation(this.character.x);
    }
}

/**
 * Waits until the boss has played all introduction frames.
 *
 * @returns {void}
 */
waitForBossIntroduction() {
    if (this.endboss.introductionFinished) {
        this.gameState = 'boss-return';
    }
}

/**
 * Moves the camera back to Sharkie after the introduction.
 *
 * @returns {void}
 */
returnCameraToCharacter() {
    const targetX = this.clampCameraX(
        -this.character.x + 150
    );

    this.moveCameraTowards(targetX);

    if (this.hasCameraReached(targetX)) {
        this.finishBossCutscene();
    }
}

/**
 * Restores controls and begins the boss fight.
 *
 * @returns {void}
 */
finishBossCutscene() {
    this.gameState = 'boss-fight';
    this.character.controlsLocked = false;
    this.character.currentImage = 0;

    this.startBossPoisonSpawning();
    }

    /**
    * Moves the camera smoothly toward a horizontal target.
    *
    * @param {number} targetX - Desired camera offset.
    * @returns {void}
    */
    moveCameraTowards(targetX) {
        const difference = targetX - this.cameraX;

        if (Math.abs(difference) <= this.cutsceneCameraSpeed) {
            this.cameraX = targetX;
            return;
        }

        this.cameraX += Math.sign(difference) *
            this.cutsceneCameraSpeed;
    }

/**
 * Checks whether the camera has reached its target.
 *
 * @param {number} targetX - Desired camera offset.
 * @returns {boolean} True when the camera is close enough.
 */
hasCameraReached(targetX) {
    return Math.abs(this.cameraX - targetX) <=
        this.cameraArrivalTolerance;
}

    /**
    * Keeps the camera within the world and the locked boss arena.
    *
    * @param {number} targetX - Requested camera offset.
    * @returns {number} Valid camera offset.
    */
    clampCameraX(targetX) {
        const minCameraX = -(
            this.levelWidth - this.canvas.width
        );

        let cameraX = Math.max(
            minCameraX,
            Math.min(0, targetX)
        );

        if (this.bossArenaLocked) {
            cameraX = Math.min(
                cameraX,
                -this.bossArenaStartX
            );
        }

        return cameraX;
    }

    /**
    * Displays the boss health during the boss fight.
    *
    * @returns {void}
    */
    drawBossHealth() {
        if (this.gameState !== 'boss-fight') return;

        this.ctx.save();

        this.ctx.font = 'bold 22px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = '#176A87';
        this.ctx.lineWidth = 4;

        const text = `Boss: ${this.endboss.energy} / 100`;

        this.ctx.strokeText(text, 450, 40);
        this.ctx.fillText(text, 450, 40);

        this.ctx.restore();
    }

    /**
 * Starts the boss death cutscene and locks Sharkie's controls.
 *
 * @returns {void}
 */
startBossDeathCutscene() {
    if (this.gameState !== 'boss-fight') return;

    this.gameState = 'boss-death-pan';
    this.character.controlsLocked = true;
    this.character.isAttacking = false;
    this.character.isBubbleAttacking = false;
    this.character.currentImage = 0;

    this.character.attackKeyLocked = true;
    this.character.bubbleKeyLocked = true;

    this.bubbles = [];
    this.bossProjectiles = [];
    this.enemySpawner.stop();
}

    /**
    * Moves the camera toward the defeated boss.
    *
    * @returns {void}
    */
    panCameraToDeadBoss() {
        const bossCenter = this.endboss.x + this.endboss.width / 2;

        const targetX = this.clampCameraX(
            this.canvas.width / 2 - bossCenter
        );

        this.moveCameraTowards(targetX);

        if (this.hasCameraReached(targetX)) {
            this.gameState = 'boss-death';
            this.endboss.startDeathAnimation();
        }
    }

    /**
    * Waits for the boss death animation to finish.
    *
    * @returns {void}
    */
    waitForBossDeath() {
        if (!this.endboss.deathAnimationFinished) return;

        this.gameState = 'won';
        this.showYouWinScreen();
    }

    /**
    * Displays the victory screen.
    *
    * @returns {void}
    */
    showYouWinScreen() {
        const winScreen = document.getElementById('you-win-screen');

        if (winScreen) {
            winScreen.classList.add('visible');
        }
    }

    /**
    * Checks whether a new poison bottle should spawn in the boss arena.
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

        if (now - this.lastBossPoisonSpawn < this.bossPoisonSpawnInterval) {
            return;
        }

        this.lastBossPoisonSpawn = now;
        this.spawnBossPoisonBottle();
    }

    /**
    * Creates a poison bottle at a random position in the boss arena.
    *
    * @returns {void}
    */
    spawnBossPoisonBottle() {
        this.removeCollectedBossPoisonBottles();

        if (this.bossPoisonBottles.length >= this.maxBossPoisonBottles) {
            return;
        }

        const minX = this.bossArenaStartX + 250;
        const maxX = this.endboss.x - 150;

        const x = minX + Math.random() * (maxX - minX);
        const y = 100 + Math.random() * 250;

        const bottle = new PoisonBottle(x, y);

        this.poisonBottles.push(bottle);
        this.bossPoisonBottles.push(bottle);
    }

    /**
    * Removes collected bottles from the boss spawn tracking array.
    *
    * @returns {void}
    */
    removeCollectedBossPoisonBottles() {
        this.bossPoisonBottles = this.bossPoisonBottles.filter(
            bottle => !bottle.collected
        );
    }

    /**
    * Resets the poison bottle spawn timer when the boss fight begins.
    *
    * @returns {void}
    */
    startBossPoisonSpawning() {
        this.lastBossPoisonSpawn = Date.now();
    }

/**
 * Triggers boss attacks when Sharkie is within attack range.
 *
 * @returns {void}
 */
updateBossAttack() {
    if (this.gameState !== 'boss-fight') return;

    const boss = this.endboss;
    const character = this.character;

    const bossCenter = boss.x + boss.width / 2;
    const characterCenter = character.x + character.width / 2;
    const distance = Math.abs(characterCenter - bossCenter);

    if (distance > boss.attackDistance + 100) return;

    boss.tryAttack();
}

/**
 * Checks whether the active boss attack hits Sharkie.
 *
 * @returns {void}
 */
checkBossAttackCollision() {
    if (this.gameState !== 'boss-fight') return;
    if (!this.endboss.isAttackActive()) return;
    if (this.character.isDead()) return;

    const attack = this.endboss.getAttackHitbox();

    const characterLeft = this.character.getLeft();
    const characterRight = this.character.getRight();
    const characterTop = this.character.getTop();
    const characterBottom = this.character.getBottom();

    const isHitting =
        attack.x < characterRight &&
        attack.x + attack.width > characterLeft &&
        attack.y < characterBottom &&
        attack.y + attack.height > characterTop;

    if (!isHitting) return;

    this.endboss.attackHasHit = true;
    this.damageCharacter(20);
}

/**
 * Updates boss movement during the active boss fight.
 *
 * @returns {void}
 */
updateBossMovement() {
    if (this.gameState !== 'boss-fight') return;

    this.endboss.moveVertically();
    this.endboss.moveTowardsCharacter(this.character);
}



/**
 * Spawns a ranged projectile when the boss is ready.
 *
 * @returns {void}
 */
updateBossRangedAttack() {
    if (this.gameState !== 'boss-fight') return;

    const boss = this.endboss;

    if (!boss.canUseRangedAttack()) return;

    const now = Date.now();
    boss.lastRangedAttackTime = now;

    const startX = boss.otherDirection
        ? boss.x + boss.width - 30
        : boss.x - 30;

    const startY = boss.y + 190;

    const targetX = this.character.x + this.character.width / 2;
    const targetY = this.character.y + this.character.height / 2;

    this.bossProjectiles.push(
        new BossProjectile(startX, startY, targetX, targetY)
    );
}

/**
 * Moves boss projectiles and checks collisions with Sharkie.
 *
 * @returns {void}
 */
updateBossProjectiles() {
    this.bossProjectiles.forEach(projectile => {
        projectile.move();
        this.checkBossProjectileCollision(projectile);
    });

    this.bossProjectiles = this.bossProjectiles.filter(projectile => {
        return !projectile.hasHit &&
            projectile.x > this.bossArenaStartX - 100 &&
            projectile.x < this.levelWidth + 100 &&
            projectile.y > -100 &&
            projectile.y < this.canvas.height + 100;
    });
}

/**
 * Checks whether a boss projectile hits Sharkie.
 *
 * @param {BossProjectile} projectile - Projectile to check.
 * @returns {void}
 */
checkBossProjectileCollision(projectile) {
    if (projectile.hasHit || this.character.isDead()) return;

    const character = this.character;

    const isHitting =
        projectile.x < character.getRight() &&
        projectile.x + projectile.width > character.getLeft() &&
        projectile.y < character.getBottom() &&
        projectile.y + projectile.height > character.getTop();

    if (!isHitting) return;

    projectile.hasHit = true;
    this.damageCharacter(projectile.damage);
}

/**
 * Draws the boss using its current facing direction.
 *
 * @returns {void}
 */
drawEndboss() {
    this.endboss.draw(this.ctx);
}
}
