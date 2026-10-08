/**
 * Represents a projectile fired by the final boss.
 */
class BossProjectile extends MovableObject {
    /** @type {number} Projectile width. */
    width = 48;

    /** @type {number} Projectile height. */
    height = 48;

    /** @type {number} Horizontal velocity. */
    speedX = 0;

    /** @type {number} Vertical velocity. */
    speedY = 0;

    /** @type {boolean} Whether the projectile has hit Sharkie. */
    hasHit = false;

    /** @type {number} Damage caused by the projectile. */
    damage = 15;

    /**
     * Creates a projectile aimed at Sharkie's current position.
     *
     * @param {number} x - Starting horizontal position.
     * @param {number} y - Starting vertical position.
     * @param {number} targetX - Target horizontal position.
     * @param {number} targetY - Target vertical position.
     */
    constructor(x, y, targetX, targetY) {
        super();

        this.x = x;
        this.y = y;

        this.setDirection(targetX, targetY);
        this.createImage();
    }

    /**
     * Calculates a normalized movement direction toward the target.
     *
     * @param {number} targetX - Target horizontal position.
     * @param {number} targetY - Target vertical position.
     * @returns {void}
     */
    setDirection(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.hypot(dx, dy) || 1;
        const speed = 3;

        this.speedX = dx / distance * speed;
        this.speedY = dy / distance * speed;
    }

   /**
 * Creates a glowing green projectile image.
 *
 * @returns {void}
 */
createImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;

    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(
        20, 17, 3,
        24, 24, 23
    );

    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#b4ff8a');
    gradient.addColorStop(0.75, '#46c93c');
    gradient.addColorStop(1, '#166b2a');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(24, 24, 22, 0, Math.PI * 2);
    ctx.fill();

    const image = new Image();

    image.src = canvas.toDataURL('image/png');

    this.img = image;
}

    /**
     * Moves the projectile through the game world.
     *
     * @returns {void}
     */
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}