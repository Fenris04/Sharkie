
/**
 * Connects touch buttons to the existing game controls.
 */
function initializeTouchControls() {
    const buttons = document.querySelectorAll('[data-control]');

    buttons.forEach(registerTouchButton);
}

/**
 * Registers pointer events for a touch control button.
 *
 * @param {HTMLButtonElement} button - Touch control button.
 * @returns {void}
 */
function registerTouchButton(button) {
    button.addEventListener('pointerdown', handleTouchStart);
    button.addEventListener('pointerup', handleTouchEnd);
    button.addEventListener('pointercancel', handleTouchEnd);
    button.addEventListener('lostpointercapture', handleTouchEnd);
}

/**
 * Activates a game control when a button is pressed.
 *
 * @param {PointerEvent} event - Pointer event.
 * @returns {void}
 */
function handleTouchStart(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const control = button.dataset.control;

    if (!Object.hasOwn(keyboard, control)) return;

    button.setPointerCapture(event.pointerId);
    keyboard[control] = true;
}

/**
 * Deactivates a game control when a button is released.
 *
 * @param {PointerEvent} event - Pointer event.
 * @returns {void}
 */
function handleTouchEnd(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const control = button.dataset.control;

    if (!Object.hasOwn(keyboard, control)) return;

    keyboard[control] = false;
}

/**
 * Releases all controls when the browser loses focus.
 *
 * @returns {void}
 */
function releaseTouchControls() {
    document.querySelectorAll('[data-control]').forEach((button) => {
        const control = button.dataset.control;
        if (Object.hasOwn(keyboard, control)) keyboard[control] = false;
    });
}

window.addEventListener('blur', releaseTouchControls);
document.addEventListener('DOMContentLoaded', initializeTouchControls);
