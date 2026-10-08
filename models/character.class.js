/**
 * Represents the playable character Sharkie.
 * Handles movement, animations, attacks, health and damage states.
 */
class Character extends MovableObject {

    /** @type {number} Horizontal position of Sharkie. */
    x = 100;

    /** @type {number} Vertical position of Sharkie. */
    y = 100;

    /** @type {number} Width of Sharkie. */
    width = 300;

    /** @type {number} Height of Sharkie. */
    height = 250;

    /** @type {number} Index of the currently displayed animation frame. */
    currentImage = 0;

    /** @type {number} Current amount of health. */
    energy = 100;

    /** @type {number} Time of the last successful hit. */
    lastHit = 0;

    /** @type {number} Time in milliseconds before Sharkie can be hit again. */
    hitCooldown = 1000;

    /** @type {boolean} Indicates whether the death animation has finished. */
    deathAnimationFinished = false;

    /** @type {boolean} Indicates whether Sharkie is performing a fin slap. */
    isAttacking = false;

    /** @type {boolean} Prevents repeated attacks while Space is held. */
    attackKeyLocked = false;

    /** @type {HTMLImageElement[]} Images used for the idle animation. */
    idleImages = [];

    /** @type {HTMLImageElement[]} Images used for the swimming animation. */
    swimImages = [];

    /** @type {HTMLImageElement[]} Images used for the hurt animation. */
    hurtImages = [];

    /** @type {HTMLImageElement[]} Images used for the death animation. */
    deadImages = [];

    /** @type {HTMLImageElement[]} Images used for the fin-slap animation. */
    attackImages = [];

    /** @type {Object} Current keyboard input state. */
    keyboard;

    /** @type {World} Reference to the current game world. */
    world;

    /** @type {number|null} ID of Sharkie's animation interval. */
    animationInterval = null;

    /** @type {number} Top offset of Sharkie's collision box. */
    offsetTop = 105;

    /** @type {number} Right offset of Sharkie's collision box. */
    offsetRight = 55;

    /** @type {number} Bottom offset of Sharkie's collision box. */
    offsetBottom = 70;

    /** @type {number} Left offset of Sharkie's collision box. */
    offsetLeft = 65;

    /** @type {HTMLImageElement[]} Images for the electric-shock animation. */
    electricHurtImages = [];

    /** @type {'poison'|'electric'} Type of the last received damage. */
    damageType = 'poison';

    /** @type {HTMLImageElement[]} Images used for electric-shock death. */
    electricDeadImages = [];

    /** @type {HTMLImageElement[]} Images used for the bubble attack. */
    bubbleAttackImages = [];

    /** @type {boolean} Indicates whether Sharkie is performing a bubble attack. */
    isBubbleAttacking = false;

    /** @type {boolean} Prevents repeated bubble attacks while A is held. */
    bubbleKeyLocked = false;

    /** @type {number} Current frame of the bubble attack. */
    bubbleImageIndex = 0;

    /**
     * Creates Sharkie and loads all required animations.
     *
     * @param {Object} keyboard - Current keyboard input state.
     * @param {World} world - Current game world.
     */
    constructor(keyboard, world) {
        super();

        this.keyboard = keyboard;
        this.world = world;

        this.loadIdleImages();
        this.loadSwimImages();
        this.loadHurtImages();
        this.loadElectricHurtImages();
        this.loadDeadImages();
        this.loadElectricDeadImages();
        this.loadAttackImages();
        this.loadBubbleAttackImages();

        this.animate();
    }


    /**
     * Loads all images used for Sharkie's idle animation.
     *
     * @returns {void}
     */
    loadIdleImages() {
        for (let i = 1; i <= 18; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/1.IDLE/${i}.png`;
            this.idleImages.push(image);
        }
    }


    /**
     * Loads all images used for Sharkie's swimming animation.
     *
     * @returns {void}
     */
    loadSwimImages() {
        for (let i = 1; i <= 6; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/3.Swim/${i}.png`;
            this.swimImages.push(image);
        }
    }


    /**
     * Loads all images used when Sharkie is poisoned.
     *
     * @returns {void}
     */
    loadHurtImages() {
        for (let i = 1; i <= 5; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/5.Hurt/1.Poisoned/${i}.png`;
            this.hurtImages.push(image);
        }
    }


    /**
     * Loads all images used for Sharkie's poisoned death animation.
     *
     * @returns {void}
     */
    loadDeadImages() {
        for (let i = 1; i <= 12; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/6.dead/1.Poisoned/${i}.png`;
            this.deadImages.push(image);
        }
    }


    /**
     * Loads all images used for Sharkie's fin-slap attack.
     *
     * @returns {void}
     */
    loadAttackImages() {
        for (let i = 1; i <= 8; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/4.Attack/Fin slap/${i}.png`;
            this.attackImages.push(image);
        }
    }


    /**
     * Starts Sharkie's animation loop.
     *
     * @returns {void}
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.updateAttackState();
            this.updateBubbleAttackState();
            this.updateAnimation();
        }, 100);
    }


    /**
     * Starts an attack when Space is pressed once.
     * Unlocks the attack after Space is released.
     *
     * @returns {void}
     */
    updateAttackState() {
        if (!this.keyboard.SPACE) {
            this.attackKeyLocked = false;
            return;
        }

        if (this.canStartAttack()) {
            this.startAttack();
        }
    }


    /**
     * Checks whether Sharkie can start a new fin-slap attack.
     *
     * @returns {boolean} True when a new attack can start.
     */
    canStartAttack() {
        return !this.attackKeyLocked &&
            !this.isAttacking &&
            !this.isBubbleAttacking &&
            !this.isHurt() &&
            !this.isDead();
    }


    /**
     * Starts a new fin-slap attack.
     *
     * @returns {void}
     */
    startAttack() {
        this.isAttacking = true;
        this.attackKeyLocked = true;
        this.currentImage = 0;
    }


    /**
     * Selects the animation matching Sharkie's current state.
     *
     * @returns {void}
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playDeathAnimation();
        } else if (this.isHurt()) {
            this.playHurtAnimation();
        } else if (this.isAttacking) {
            this.playAttackAnimation();
        } else if (this.isBubbleAttacking) {
            this.playBubbleAttackAnimation();
        } else if (this.isMoving()) {
            this.playAnimation(this.swimImages);
        } else {
            this.playAnimation(this.idleImages);
        }
    }


    /**
     * Displays the next frame of a repeating animation.
     *
     * @param {HTMLImageElement[]} images - Animation frames to display.
     * @returns {void}
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;

        this.img = images[index];
        this.currentImage++;
    }


    /**
     * Plays the fin-slap animation exactly once.
     *
     * @returns {void}
     */
    playAttackAnimation() {
        if (this.currentImage < this.attackImages.length) {
            this.img = this.attackImages[this.currentImage];
            this.currentImage++;
            return;
        }

        this.finishAttack();
    }


    /**
     * Finishes the current fin-slap attack.
     *
     * @returns {void}
     */
    finishAttack() {
        this.isAttacking = false;
        this.currentImage = 0;
    }


    /**
    * Plays the death animation matching the last damage type.
    * The animation is played only once.
    *
    * @returns {void}
    */
    playDeathAnimation() {
        if (this.deathAnimationFinished) {
           return;
        }

        const images = this.getDeathImages();

        if (this.currentImage < images.length) {
            this.img = images[this.currentImage];
            this.currentImage++;
        } else {
            this.finishDeathAnimation();
        }
    }


    /**
    * Finishes the death animation and keeps its final frame visible.
    *
    * @returns {void}
    */
    finishDeathAnimation() {
        const images = this.getDeathImages();
        const lastImage = images.length - 1;

        this.img = images[lastImage];
        this.deathAnimationFinished = true;
    }


    /**
     * Moves Sharkie according to the current keyboard input.
     * Movement is disabled after Sharkie dies.
     *
     * @returns {void}
     */
    move() {
        if (this.isDead()) {
            return;
        }

        this.moveHorizontally();
        this.moveVertically();
    }


    /**
     * Handles horizontal movement and direction.
     *
     * @returns {void}
     */
    moveHorizontally() {
        if (this.keyboard.RIGHT && this.canMoveRight()) {
            this.moveRight();
            this.otherDirection = false;
        }

        if (this.keyboard.LEFT && this.canMoveLeft()) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }


    /**
     * Handles vertical movement.
     *
     * @returns {void}
     */
    moveVertically() {
        if (this.keyboard.UP && this.canMoveUp()) {
            this.moveUp();
        }

        if (this.keyboard.DOWN && this.canMoveDown()) {
            this.moveDown();
        }
    }


    /**
     * Checks whether a movement key is currently pressed.
     *
     * @returns {boolean} True when a movement key is pressed.
     */
    isMoving() {
        return this.keyboard.RIGHT ||
            this.keyboard.LEFT ||
            this.keyboard.UP ||
            this.keyboard.DOWN;
    }


    /**
     * Checks whether Sharkie can move farther to the right.
     *
     * @returns {boolean} True when movement is possible.
     */
    canMoveRight() {
        return this.x + this.width < this.world.levelWidth;
    }


    /**
     * Checks whether Sharkie can move farther to the left.
     *
     * @returns {boolean} True when movement is possible.
     */
    canMoveLeft() {
        return this.x > 0;
    }


    /**
     * Checks whether Sharkie can move farther upward.
     *
     * @returns {boolean} True when movement is possible.
     */
    canMoveUp() {
        return this.y > 0;
    }


    /**
     * Checks whether Sharkie can move farther downward.
     *
     * @returns {boolean} True when movement is possible.
     */
    canMoveDown() {
        return this.y + this.height < 480;
    }


    /**
    * Reduces Sharkie's health and stores the received damage type.
    *
    * @param {number} damage - Amount of health to remove.
    * @param {'poison'|'electric'} [type='poison'] - Type of damage.
    * @returns {void}
    */
    hit(damage, type = 'poison') {
        if (!this.canReceiveDamage() || this.isDead()) {
            return;
        }

        this.energy = Math.max(0, this.energy - damage);
        this.damageType = type;
        this.lastHit = Date.now();
        this.isAttacking = false;
        this.isBubbleAttacking = false;
        this.currentImage = 0;
    }


    /**
     * Checks whether Sharkie can currently receive damage.
     *
     * @returns {boolean} True when another hit can be received.
     */
    canReceiveDamage() {
        return Date.now() - this.lastHit > this.hitCooldown;
    }


    /**
     * Checks whether Sharkie is currently hurt.
     *
     * @returns {boolean} True shortly after receiving damage.
     */
    isHurt() {
        return Date.now() - this.lastHit < this.hitCooldown;
    }


    /**
     * Checks whether Sharkie has no health remaining.
     *
     * @returns {boolean} True when Sharkie is dead.
     */
    isDead() {
        return this.energy === 0;
    }


    /**
     * Checks whether Sharkie's death animation has finished.
     *
     * @returns {boolean} True when Sharkie is dead and the animation is complete.
     */
    isDeathAnimationFinished() {
        return this.isDead() && this.deathAnimationFinished;
    }


    /**
     * Stops all running intervals of Sharkie.
     *
     * @returns {void}
     */
    stopIntervals() {
        clearInterval(this.animationInterval);
    }

    /**
    * Returns the collision area of Sharkie's fin-slap attack.
    *
    * @returns {{x: number, y: number, width: number, height: number}}
    * Attack collision area.
    */
    getAttackHitbox() {
        const width = 80;
        const height = 90;

        return {
            x: this.getAttackHitboxX(width),
            y: this.y + 95,
            width: width,
            height: height
        };
    }


    /**
    * Calculates the horizontal position of the attack hitbox.
    *
    * @param {number} width - Width of the attack hitbox.
    * @returns {number} Horizontal attack position.
    */
    getAttackHitboxX(width) {
        if (this.otherDirection) {
            return this.getLeft() - width;
        }

        return this.getRight();
    }


    /**
    * Checks whether the fin slap is currently in its active hit phase.
    *
    * @returns {boolean} True when the attack can damage an enemy.
    */
    canAttackEnemy() {
        const firstHitFrame = 4;
        const lastHitFrame = 6;

        return this.isAttacking &&
            this.currentImage >= firstHitFrame &&
            this.currentImage <= lastHitFrame;
    }


    /**
    * Loads Sharkie's electric-shock hurt animation frames.
    *
    * @returns {void}
    */
    loadElectricHurtImages() {
        for (let i = 1; i <= 3; i++) {
            const image = new Image();
            image.src = `assets/1.Sharkie/5.Hurt/2.Electric shock/${i}.png`;
            this.electricHurtImages.push(image);
        }
    }

    /**
    * Plays the hurt animation matching the last damage type.
    *
    * @returns {void}
    */
    playHurtAnimation() {
        if (this.damageType === 'electric') {
            this.playAnimation(this.electricHurtImages);
            return;
        }

        this.playAnimation(this.hurtImages);
    }

    /**
    * Loads all frames of Sharkie's electric-shock death animation.
    *
    * @returns {void}
    */
    loadElectricDeadImages() {
        for (let i = 1; i <= 10; i++) {
            const image = new Image();

            image.src =
                `assets/1.Sharkie/6.dead/2.Electro_shock/${i}.png`;

            this.electricDeadImages.push(image);
        }
    }

    /**
    * Returns the death animation for the last received damage type.
    *
    * @returns {HTMLImageElement[]} Matching death animation frames.
    */
    getDeathImages() {
        if (this.damageType === 'electric') {
            return this.electricDeadImages;
        }

        return this.deadImages;
    }

    /**
    * Loads all frames used for Sharkie's bubble attack.
    *
    * @returns {void}
    */
    loadBubbleAttackImages() {
        for (let i = 1; i <= 8; i++) {
            const image = new Image();

            image.src =
                `assets/1.Sharkie/4.Attack/Bubble trap/` +
                `op1 (with bubble formation)/${i}.png`;

            this.bubbleAttackImages.push(image);
        }
    }

    /**
    * Checks the bubble attack input and starts an attack if possible.
    *
    * @returns {void}
    */
    updateBubbleAttackState() {
        if (!this.keyboard.A) {
            this.bubbleKeyLocked = false;
            return;
        }

        if (this.canStartBubbleAttack()) {
            this.startBubbleAttack();
        }
    }


    /**
    * Checks whether Sharkie can perform a bubble attack.
    *
    * @returns {boolean} True when a bubble attack can start.
    */
    canStartBubbleAttack() {
        return !this.bubbleKeyLocked &&
            !this.isBubbleAttacking &&
            !this.isAttacking &&
            !this.isHurt() &&
            !this.isDead();
    }


    /**
    * Starts a new bubble attack.
    *
    * @returns {void}
    */
    startBubbleAttack() {
        this.isBubbleAttacking = true;
        this.bubbleKeyLocked = true;
        this.bubbleImageIndex = 0;
    }

    /**
    * Plays the bubble attack and fires one projectile.
    *
    * @returns {void}
    */
    playBubbleAttackAnimation() {
        if (this.bubbleImageIndex >= this.bubbleAttackImages.length) {
            this.finishBubbleAttack();
            return;
        }

        this.img = this.bubbleAttackImages[this.bubbleImageIndex];

        if (this.bubbleImageIndex === 5) {
            this.shootBubble();
        }

        this.bubbleImageIndex++;
    }


    /**
    * Finishes the current bubble attack.
    *
    * @returns {void}
    */
    finishBubbleAttack() {
        this.isBubbleAttacking = false;
        this.bubbleImageIndex = 0;
        this.currentImage = 0;
    }

    /**
    * Creates a bubble projectile in front of Sharkie.
    *
    * @returns {void}
    */
    shootBubble() {
        const bubbleX = this.otherDirection
        ? this.x + 35
        : this.x + this.width - 95;

        const bubbleY = this.y + 110;

        this.world.bubbles.push(
            new Bubble(bubbleX, bubbleY, this.otherDirection)
        );
    }
}