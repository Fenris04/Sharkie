
/**
 * Provides Sharkie's properties, image loading and basic attack controls.
 */
class CharacterBase extends MovableObject {

    /** @type {number} Horizontal position of Sharkie. */
    x = 100;

    /** @type {number} Vertical position of Sharkie. */
    y = 100;

    /** @type {number} Width of Sharkie. */
    width = 300;

    /** @type {number} Height of Sharkie. */
    height = 250;

    /** @type {number} Current animation frame. */
    currentImage = 0;

    /** @type {number} Current health. */
    energy = 100;

    /** @type {number} Timestamp of the last received hit. */
    lastHit = 0;

    /** @type {number} Damage cooldown in milliseconds. */
    hitCooldown = 1000;

    /** @type {boolean} Whether the death animation is complete. */
    deathAnimationFinished = false;

    /** @type {boolean} Whether a fin-slap attack is active. */
    isAttacking = false;

    /** @type {boolean} Prevents repeated fin-slap attacks. */
    attackKeyLocked = false;

    /** @type {HTMLImageElement[]} Idle animation frames. */
    idleImages = [];

    /** @type {HTMLImageElement[]} Swimming animation frames. */
    swimImages = [];

    /** @type {HTMLImageElement[]} Poison damage animation frames. */
    hurtImages = [];

    /** @type {HTMLImageElement[]} Poison death animation frames. */
    deadImages = [];

    /** @type {HTMLImageElement[]} Fin-slap animation frames. */
    attackImages = [];

    /** @type {Object} Current keyboard state. */
    keyboard;

    /** @type {World} Current game world. */
    world;

    /** @type {number|null} Animation interval identifier. */
    animationInterval = null;

    /** @type {number} Top collision offset. */
    offsetTop = 120;

    /** @type {number} Right collision offset. */
    offsetRight = 55;

    /** @type {number} Bottom collision offset. */
    offsetBottom = 70;

    /** @type {number} Left collision offset. */
    offsetLeft = 65;

    /** @type {HTMLImageElement[]} Electric damage frames. */
    electricHurtImages = [];

    /** @type {'poison'|'electric'} Last damage type. */
    damageType = 'poison';

    /** @type {HTMLImageElement[]} Electric death frames. */
    electricDeadImages = [];

    /** @type {HTMLImageElement[]} Bubble attack frames. */
    bubbleAttackImages = [];

    /** @type {boolean} Whether a bubble attack is active. */
    isBubbleAttacking = false;

    /** @type {boolean} Prevents repeated bubble attacks. */
    bubbleKeyLocked = false;

    /** @type {number} Current bubble attack frame. */
    bubbleImageIndex = 0;

    /** @type {number} Available poison ammunition. */
    poison = 5;

    /** @type {number} Maximum poison ammunition. */
    maxPoison = 5;

    /** @type {boolean} Whether controls are disabled. */
    controlsLocked = false;

    /**
     * Initializes Sharkie's controls and animations.
     *
     * @param {Object} keyboard - Current keyboard state.
     * @param {World} world - Current game world.
     */
    constructor(keyboard, world) {
        super();
        this.keyboard = keyboard;
        this.world = world;
        this.loadAllImages();
        this.animate();
    }

    /**
     * Loads all required animation images.
     *
     * @returns {void}
     */
    loadAllImages() {
        this.loadIdleImages();
        this.loadSwimImages();
        this.loadHurtImages();
        this.loadElectricHurtImages();
        this.loadDeadImages();
        this.loadElectricDeadImages();
        this.loadAttackImages();
        this.loadBubbleAttackImages();
    }

    /**
     * Loads Sharkie's idle animation.
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
     * Loads Sharkie's swimming animation.
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
     * Loads the poisoned hurt animation.
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
     * Loads the poisoned death animation.
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
     * Loads the fin-slap attack animation.
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
    * Starts Sharkie's animation interval.
    *
    * @returns {void}
    */
    animate() {
        if (this.animationInterval !== null) return;

        this.animationInterval = setInterval(() => {
            if (this.world.paused || !this.world.running) return;

            this.updateAttackState();
            this.updateBubbleAttackState();
            this.updateAnimation();
        }, 100);
    }

    /**
     * Processes the fin-slap attack input.
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
     * Checks whether a fin-slap attack can start.
     *
     * @returns {boolean} Whether an attack is available.
     */
    canStartAttack() {
        return !this.controlsLocked &&
            !this.attackKeyLocked &&
            !this.isAttacking &&
            !this.isBubbleAttacking &&
            !this.isHurt() &&
            !this.isDead();
    }

    /**
    * Starts a fin-slap attack and plays its sound.
    *
    * @returns {void}
    */
    startAttack() {
        this.isAttacking = true;
        this.attackKeyLocked = true;
        this.currentImage = 0;
        audioManager.playSound('finSlap', 0.4);
    }
}
