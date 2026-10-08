/**
 * Represents the complete game world.
 * Controls rendering, movement, collisions and the camera.
 */
class World {

    /** @type {HTMLCanvasElement} Canvas used to display the game. */
    canvas;

    /** @type {CanvasRenderingContext2D} Rendering context of the canvas. */
    ctx;

    /** @type {Character} The playable character Sharkie. */
    character;

    /** @type {number} Total width of the game world. */
    levelWidth = 2160;

    /** @type {number} Current horizontal camera position. */
    cameraX = 0;

    /** @type {BackgroundObject[]} Background images of the game world. */
    backgrounds = [
        new BackgroundObject(
            'assets/3. Background/Light/full.png',
            0
        ),
        new BackgroundObject(
            'assets/3. Background/Light/full.png',
            720
        ),
        new BackgroundObject(
            'assets/3. Background/Light/full.png',
            1440
        )
    ];

    /** @type {PufferFish[]} Enemies currently placed in the game world. */
    enemies = [
        new PufferFish(900, 100),
        new PufferFish(1300, 280),
        new PufferFish(1800, 180)
    ];

    /** @type {JellyFish[]} Jellyfish currently placed in the game world. */
    jellyfish = [
        new JellyFish(1100, 180),
        new JellyFish(1650, 260)
    ];

    /** @type {StatusBar} Displays Sharkie's current health. */
    statusBar = new StatusBar();

    /** @type {boolean} Indicates whether the game-over screen is visible. */
    gameOver = false;

    /** @type {boolean} Indicates whether this world is still running. */
    running = true;

    /** @type {Bubble[]} Active bubble projectiles. */
    bubbles = [];

    /**
     * Creates a new game world.
     *
     * @param {HTMLCanvasElement} canvas - Canvas used to render the game.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.character = new Character(keyboard, this);

        this.draw();
    }


    /**
    * Continuously updates and redraws the game world.
    *
    * @returns {void}
    */
    draw() {
        if (!this.running) {
            return;
        }

        this.clearCanvas();
        this.update();
        this.drawGameWorld();

        requestAnimationFrame(() => this.draw());
    }


    /**
    * Updates all game logic before the next frame is drawn.
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
        this.updateCamera();
        this.checkGameOver();
    }


    /**
     * Clears the complete canvas before drawing the next frame.
     *
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    /**
     * Draws the game world and the fixed user interface.
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
     * Draws all objects that move together with the game world.
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
     * Draws multiple drawable objects onto the canvas.
     *
     * @param {DrawableObject[]} objects - Objects that should be drawn.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            object.draw(this.ctx);
        });
    }


    /**
    * Draws collision hitboxes for development purposes.
    *
    * @returns {void}
    */
    drawHitboxes() {
        this.character.drawHitbox(this.ctx);

        this.enemies.forEach(enemy => {
            enemy.drawHitbox(this.ctx);
        });

        this.jellyfish.forEach(jellyfish => {
            jellyfish.drawHitbox(this.ctx);
        });
    }


    /**
    * Checks collisions between Sharkie and living enemies.
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
    * Checks whether an enemy can currently damage Sharkie.
    *
    * @param {PufferFish} enemy - Enemy that should be checked.
    * @returns {boolean} True when the enemy touches Sharkie.
    */
    canEnemyDamageCharacter(enemy) {
        return !enemy.isDead() &&
            this.character.isColliding(enemy);
    }


    /**
    * Damages Sharkie and updates the health status bar.
    *
    * @param {number} [damage=20] - Amount of damage.
    * @param {'poison'|'electric'} [type='poison'] - Damage type.
    * @returns {void}
    */
    damageCharacter(damage = 20, type = 'poison') {
        this.character.hit(damage, type);
        this.statusBar.setPercentage(this.character.energy);
    }


    /**
     * Updates the horizontal camera position based on Sharkie's position.
     * Prevents the camera from moving outside the game world.
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
    * Checks whether the game should enter the game-over state.
    *
    * @returns {void}
    */
    checkGameOver() {
        if (!this.character.isDeathAnimationFinished()) {
            return;
        }

        this.showGameOverScreen();
    }


    /**
    * Displays the game-over screen once.
    *
    * @returns {void}
    */
    showGameOverScreen() {
        if (this.gameOver) {
            return;
        }

        this.gameOver = true;

        const gameOverScreen = document.getElementById(
            'game-over-screen'
        );

        gameOverScreen.classList.add('visible');
    }

    /**
 * Stops the current game world and all running intervals.
 *
 * @returns {void}
 */
stop() {
    this.running = false;
    this.character.stopIntervals();
    this.stopEnemyIntervals();
    this.stopJellyfishIntervals();
}


    /**
    * Stops all intervals belonging to the enemies.
    *
    * @returns {void}
    */
    stopEnemyIntervals() {
        this.enemies.forEach(enemy => {
            enemy.stopIntervals();
        });
    }

    /**
 * Checks whether Sharkie's fin slap hits an enemy.
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
}


    /**
    * Checks whether the attack hitbox overlaps an enemy.
    *
    * @param {PufferFish} enemy - Enemy that should be checked.
    * @returns {boolean} True when the fin slap hits the enemy.
    */
    isAttackHittingEnemy(enemy) {
        if (enemy.isDead()) {
            return false;
        }

        const attack = this.character.getAttackHitbox();

        return attack.x < enemy.getRight() &&
            attack.x + attack.width > enemy.getLeft() &&
            attack.y < enemy.getBottom() &&
            attack.y + attack.height > enemy.getTop();
    }


    /**
    * Removes defeated enemies after they leave the canvas.
    *
    * @returns {void}
    */
    removeDefeatedEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            return !enemy.isDead() || enemy.y < 480;
        });
    }

 
    /**
    * Stops all running jellyfish intervals.
    *
    * @returns {void}
    */
    stopJellyfishIntervals() {
        this.jellyfish.forEach(jellyfish => {
            jellyfish.stopIntervals();
        });
    }

   /**
 * Checks collisions between Sharkie and living jellyfish.
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
    * Moves all active bubbles and removes those outside the level.
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
     * Checks whether bubbles collide with jellyfish.
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
    * Removes jellyfish only after their death animation finishes.
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

}