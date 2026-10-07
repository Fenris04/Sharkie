/**
 * Represents the game world.
 * Manages the character, backgrounds, camera and rendering.
 */
class World {

    /** @type {Character} The playable Sharkie character. */
    character;

    /** @type {HTMLCanvasElement} Canvas used to display the game. */
    canvas;

    /** @type {CanvasRenderingContext2D} Drawing context of the canvas. */
    ctx;

    /** @type {number} Total width of the game world in pixels. */
    levelWidth = 2160;

    /** @type {number} Horizontal position of the camera. */
    cameraX = 0;

    /** @type {BackgroundObject[]} Background images of the game world. */
    backgrounds = [
        new BackgroundObject('assets/3. Background/Light/full.png', 0),
        new BackgroundObject('assets/3. Background/Light/full.png', 720),
        new BackgroundObject('assets/3. Background/Light/full.png', 1440)
    ];

    /** @type {PufferFish[]} Enemies currently inside the game world. */
    enemies = [
    new PufferFish(900, 100),
    new PufferFish(1300, 280),
    new PufferFish(1800, 180)
    ];


    /**
     * Creates the game world.
     *
     * @param {HTMLCanvasElement} canvas - Canvas used to display the game.
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
        this.clearCanvas();
        this.drawGameWorld();
        this.updateCamera();

        requestAnimationFrame(() => this.draw());
    }


 /**
 * Draws all objects that belong to the game world.
 *
 * @returns {void}
 */
drawGameWorld() {
    this.ctx.save();
    this.ctx.translate(this.cameraX, 0);

    this.addObjectsToMap(this.backgrounds);
    this.addObjectsToMap(this.enemies);
    this.character.move();
    this.character.draw(this.ctx);
    this.drawHitboxes();

    this.ctx.restore();
}

/**
 * Draws hitboxes of relevant game objects for development.
 *
 * @returns {void}
 */
drawHitboxes() {
    this.character.drawHitbox(this.ctx);

    this.enemies.forEach(enemy => {
        enemy.drawHitbox(this.ctx);
    });
}



    /**
     * Draws every object of an array onto the canvas.
     *
     * @param {DrawableObject[]} objects - Objects that should be drawn.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(object => object.draw(this.ctx));
    }


    /**
    * Updates the camera position while keeping it inside the level.
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
     * Clears the canvas before drawing the next frame.
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
}