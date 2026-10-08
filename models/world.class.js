
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
    levelWidth = 8640;

    /** @type {number} Horizontal camera offset. */
    cameraX = 0;

    /** @type {BackgroundObject[]} Repeating background images. */
    backgrounds = Array.from({ length: 12 }, (_, index) =>
        new BackgroundObject(
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
     * Updates movement, collisions, collectibles, and game state.
     *
     * @returns {void}
     */
    update() {
        this.character.move();
        this.updateBubbles();
        this.checkCollisions();
        this.checkJellyfishCollisions();
        this.checkAttackCollisions();
        this.checkBubbleCollisions();
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
        this.drawPoisonCounter();
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
        this.character.draw(this.ctx);
        this.drawHitboxes();
        this.addObjectsToMap(this.poisonBottles);
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
            if (this.isAttackHittingEnemy(enemy)) enemy.die();
        });
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
        });
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
     * Updates the horizontal camera position.
     *
     * @returns {void}
     */
    updateCamera() {
        const desiredCameraX = -this.character.x + 150;
        const minCameraX = -(this.levelWidth - this.canvas.width);

        this.cameraX = Math.min(0, desiredCameraX);
        this.cameraX = Math.max(minCameraX, this.cameraX);
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
    * Checks collisions between Sharkie and poison bottles.
    *
    * @returns {void}
    */
    checkPoisonBottleCollisions() {
        this.poisonBottles.forEach(bottle => {
            if (!bottle.collected &&
                !this.character.isDead() &&
                this.character.isColliding(bottle)) {
                this.collectPoisonBottle(bottle);
           }
     });

        this.poisonBottles = this.poisonBottles.filter(
            bottle => !bottle.collected
        );
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
}
