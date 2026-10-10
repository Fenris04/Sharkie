
/**
 * Manages boss cutscenes, arena boundaries, and camera movement.
 */
class WorldBossCutscene extends WorldBoss {

    /**
     * Locks the boss arena after the boss is activated.
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
     * Checks whether a boss cutscene is active.
     *
     * @returns {boolean} True during a boss cutscene.
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
     * Starts the boss introduction cutscene.
     *
     * @returns {void}
     */
    startBossCutscene() {
        this.gameState = 'boss-pan';
        this.bossArenaLocked = true;
        this.enemySpawner.stop();
        this.lockCharacterControls();
    }

    /**
     * Locks Sharkie's controls and resets attack states.
     *
     * @returns {void}
     */
    lockCharacterControls() {
        this.character.controlsLocked = true;
        this.character.isAttacking = false;
        this.character.isBubbleAttacking = false;
        this.character.currentImage = 0;
        this.character.attackKeyLocked = true;
        this.character.bubbleKeyLocked = true;
    }

    /**
     * Updates the active boss cutscene phase.
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
     * Moves the camera toward the boss for the introduction.
     *
     * @returns {void}
     */
    panCameraToBoss() {
        const targetX = this.getBossCameraTarget();
        this.moveCameraTowards(targetX);

        if (this.hasCameraReached(targetX)) {
            this.gameState = 'boss-intro';
            this.endboss.checkActivation(this.character.x);
        }
    }

    /**
     * Calculates the camera position centered on the boss.
     *
     * @returns {number} Target camera offset.
     */
    getBossCameraTarget() {
        const bossCenter =
            this.endboss.x + this.endboss.width / 2;

        return this.clampCameraX(
            this.canvas.width / 2 - bossCenter
        );
    }

    /**
     * Waits for the boss introduction animation.
     *
     * @returns {void}
     */
    waitForBossIntroduction() {
        if (this.endboss.introductionFinished) {
            this.gameState = 'boss-return';
        }
    }

    /**
     * Returns the camera to Sharkie after the introduction.
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
     * Restores controls and starts the boss fight.
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
     * Moves the camera toward a horizontal target.
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

        this.cameraX +=
            Math.sign(difference) * this.cutsceneCameraSpeed;
    }

    /**
     * Checks whether the camera has reached its target.
     *
     * @param {number} targetX - Desired camera offset.
     * @returns {boolean} True when the target is reached.
     */
    hasCameraReached(targetX) {
        return Math.abs(this.cameraX - targetX) <=
            this.cameraArrivalTolerance;
    }

    /**
     * Keeps the camera inside the world and boss arena.
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
     * Follows Sharkie while respecting camera boundaries.
     *
     * @returns {void}
     */
    updateCamera() {
        const desiredCameraX = -this.character.x + 150;
        this.cameraX = this.clampCameraX(desiredCameraX);
    }

    /**
     * Starts the boss death cutscene.
     *
     * @returns {void}
     */
    startBossDeathCutscene() {
        if (this.gameState !== 'boss-fight') return;

        this.gameState = 'boss-death-pan';
        this.lockCharacterControls();
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
        const targetX = this.getBossCameraTarget();
        this.moveCameraTowards(targetX);

        if (this.hasCameraReached(targetX)) {
            this.gameState = 'boss-death';
            this.endboss.startDeathAnimation();
        }
    }

    /**
     * Waits until the boss death animation finishes.
     *
     * @returns {void}
     */
    waitForBossDeath() {
        if (!this.endboss.deathAnimationFinished) return;

        this.gameState = 'won';
        this.showYouWinScreen();
    }

    /**
    * Displays the victory screen and starts victory music.
    *
    * @returns {void}
    */
    showYouWinScreen() {
        const winScreen =
            document.getElementById('you-win-screen');

        if (!winScreen || winScreen.classList.contains('visible')) {
            return;
        }

        audioManager.stopMusic();
        audioManager.playMusic('victory');

        winScreen.classList.add('visible');
    }
}
