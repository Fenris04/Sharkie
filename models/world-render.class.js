
/**
 * Handles canvas rendering for the game world.
 */
class WorldRender extends WorldBase {

    /**
     * Clears the visible canvas.
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
     * Draws the scrolling world and fixed screen elements.
     *
     * @returns {void}
     */
    drawGameWorld() {
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawWorldObjects();
        this.ctx.restore();

        this.drawStatusBars();
        this.drawBossHealth();
    }

    /**
     * Draws the fixed status bars and counters.
     *
     * @returns {void}
     */
    drawStatusBars() {
        this.statusBar.draw(this.ctx);
        this.coinStatusBar.draw(this.ctx);
        this.drawCoinCounter();
        this.updatePoisonStatusBar();
        this.poisonStatusBar.draw(this.ctx);
    }

    /**
     * Draws all objects inside the scrolling world.
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
        this.drawCharacterAndHitboxes();
        this.addObjectsToMap(this.poisonBottles);
        this.addObjectsToMap(this.bossProjectiles);
    }

    /**
     * Draws Sharkie and the collision hitboxes.
     *
     * @returns {void}
     */
    drawCharacterAndHitboxes() {
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

        this.enemies.forEach(enemy => {
            enemy.drawHitbox(this.ctx);
        });

        this.jellyfish.forEach(jellyfish => {
            jellyfish.drawHitbox(this.ctx);
        });
    }

    /**
     * Draws every object in an array.
     *
     * @param {DrawableObject[]} objects - Objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            object.draw(this.ctx);
        });
    }

    /**
     * Draws the final boss.
     *
     * @returns {void}
     */
    drawEndboss() {
        this.endboss.draw(this.ctx);
    }

    /**
     * Draws the collected coin count.
     *
     * @returns {void}
     */
    drawCoinCounter() {
        this.ctx.save();
        this.applyCounterStyle(18, 3);

        const text = `${this.collectedCoins} / ${this.totalCoins}`;

        this.ctx.textBaseline = 'middle';
        this.drawOutlinedText(text, 225, 105);
        this.ctx.restore();
    }

    /**
     * Draws the remaining poison ammunition.
     *
     * @returns {void}
     */
    drawPoisonCounter() {
        this.ctx.save();
        this.applyCounterStyle(18, 3);

        const text = `Poison: ${this.character.poison}`;

        this.drawOutlinedText(text, 25, 150);
        this.ctx.restore();
    }

    /**
     * Draws the boss health during the boss fight.
     *
     * @returns {void}
     */
    drawBossHealth() {
        if (this.gameState !== 'boss-fight') {
            return;
        }

        this.ctx.save();
        this.applyCounterStyle(22, 4);

        const text = `Boss: ${this.endboss.energy} / 100`;

        this.drawOutlinedText(text, 450, 40);
        this.ctx.restore();
    }

    /**
     * Applies the original counter text appearance.
     *
     * @param {number} fontSize - Font size in pixels.
     * @param {number} lineWidth - Outline width.
     * @returns {void}
     */
    applyCounterStyle(fontSize, lineWidth) {
        this.ctx.font = `bold ${fontSize}px Arial`;
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = '#176A87';
        this.ctx.lineWidth = lineWidth;
    }

    /**
     * Draws text with a colored outline.
     *
     * @param {string} text - Text to display.
     * @param {number} x - Horizontal screen position.
     * @param {number} y - Vertical screen position.
     * @returns {void}
     */
    drawOutlinedText(text, x, y) {
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }
}
