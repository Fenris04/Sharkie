/**
 * Manages the game world, collisions, camera, and enemies.
 */
class World {
    /** @type {HTMLCanvasElement} Game canvas. */
    canvas;

    /** @type {CanvasRenderingContext2D} Canvas drawing context. */
    ctx;

    /** @type {Character} Player character. */
    character;

    /** @type {number} Total level width. */
    levelWidth = 8640;

    /** @type {number} Horizontal camera offset. */
    cameraX = 0;

    /** @type {BackgroundObject[]} Repeating background tiles. */
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

    /** @type {StatusBar} Sharkie's health bar. */
    statusBar = new StatusBar();

    /** @type {EnemySpawner} Random enemy generator. */
    enemySpawner;

    /** @type {boolean} Whether the game-over screen was shown. */
    gameOver = false;

    /** @type {boolean} Whether the game loop is running. */
    running = true;

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
     * Runs the game loop.
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
     * Updates all gameplay systems.
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
     * Draws world objects with the camera offset and the health bar.
     *
     * @returns {void}
     */
    drawGameWorld() {
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawWorldObjects();
        this.ctx.restore();
        this.statusBar.draw(this.ctx);
    }

    /**
     * Draws all objects inside the game world.
     *
     * @returns {void}
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.backgrounds);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.jellyfish);
        this.addObjectsToMap(this.bubbles);
        this.character.draw(this.ctx);
        this.drawHitboxes();
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
     * Draws each object from an array.
     *
     * @param {DrawableObject[]} objects - Objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(object => object.draw(this.ctx));
    }

    /**
     * Checks collisions between Sharkie and living puffer fish.
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
     * @returns {boolean} Whether the enemy touches Sharkie.
     */
    canEnemyDamageCharacter(enemy) {
        return !enemy.isDead() && this.character.isColliding(enemy);
    }

    /**
     * Checks collisions between Sharkie and living jellyfish.
     *
     * @returns {void}
     */
    checkJellyfishCollisions() {
        this.jellyfish.forEach(jellyfish => {
            if (!jellyfish.isDead() && this.character.isColliding(jellyfish)) {
                this.damageCharacter(20, 'electric');
            }
        });
    }

    /**
     * Applies damage to Sharkie and updates the health bar.
     *
     * @param {number} damage - Damage amount.
     * @param {string} type - Damage animation type.
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
     * Checks whether the fin-slap hitbox overlaps a puffer fish.
     *
     * @param {PufferFish} enemy - Enemy to check.
     * @returns {boolean} Whether the attack hits the enemy.
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
     * Removes living enemies that have left the left world boundary.
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
    * Stops enemies that have moved far behind the visible camera area.
    *
    * @param {MovableObject} enemy - Enemy to check.
    * @returns {boolean} Whether the enemy should remain active.
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
     * Keeps the camera following Sharkie within level boundaries.
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
     * Checks whether Sharkie's death animation has finished.
     *
     * @returns {void}
     */
    checkGameOver() {
        if (!this.character.isDeathAnimationFinished()) return;
        this.showGameOverScreen();
    }

    /**
     * Displays the game-over overlay once.
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
     * Stops the game and all active intervals.
     *
     * @returns {void}
     */
    stop() {
        this.running = false;
        this.enemySpawner.stop();
        this.character.stopIntervals();
        this.stopEnemyIntervals();
        this.stopJellyfishIntervals();
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
}