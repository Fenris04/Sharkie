
/**
 * Represents Sharkie and handles his attack hitboxes and bubbles.
 */
class Character extends CharacterAnimation {

    /**
     * Returns the collision area of Sharkie's fin-slap attack.
     *
     * @returns {{x: number, y: number, width: number, height: number}}
     * The attack hitbox.
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
     * Checks whether the fin slap can damage an enemy.
     *
     * @returns {boolean} True during the active attack frames.
     */
    canAttackEnemy() {
        const firstHitFrame = 4;
        const lastHitFrame = 6;

        return this.isAttacking &&
            this.currentImage >= firstHitFrame &&
            this.currentImage <= lastHitFrame;
    }

    /**
     * Loads Sharkie's bubble attack animation.
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
     * Processes the bubble attack input.
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
     * Checks whether Sharkie can start a bubble attack.
     *
     * @returns {boolean} True if an attack is available.
     */
    canStartBubbleAttack() {
        return !this.controlsLocked &&
            !this.bubbleKeyLocked &&
            !this.isBubbleAttacking &&
            !this.isAttacking &&
            !this.isHurt() &&
            !this.isDead() &&
            this.poison > 0;
    }

    /**
     * Starts a bubble attack and consumes one poison charge.
     *
     * @returns {void}
     */
    startBubbleAttack() {
        this.isBubbleAttacking = true;
        this.bubbleKeyLocked = true;
        this.bubbleImageIndex = 0;
        this.poison--;
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
    * Creates a bubble projectile and plays its sound.
    *
    * @returns {void}
    */
    shootBubble() {
        const bubbleX = this.otherDirection
            ? this.x + 35
            : this.x + this.width - 95;

        const bubbleY = this.y + 110;

        this.world.bubbles.push(
            new Bubble(bubbleX, bubbleY, this.otherDirection, this.world)
        );

        audioManager.playSound('bubble', 0.45);
    }
}
