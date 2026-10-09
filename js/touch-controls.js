
/**
 * Connects touch buttons to the existing game controls.
 *
 * @returns {void}
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
    if (!canAcceptGameInput()) return;

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
 * Releases all active touch controls.
 *
 * @returns {void}
 */
function releaseTouchControls() {
    document.querySelectorAll('[data-control]').forEach(releaseTouchButton);
}

/**
 * Releases a single touch button and its game control.
 *
 * @param {HTMLButtonElement} button - Touch control button.
 * @returns {void}
 */
function releaseTouchButton(button) {
    const control = button.dataset.control;
    if (Object.hasOwn(keyboard, control)) keyboard[control] = false;

    if (button.hasPointerCapture && button.releasePointerCapture) {
        releaseCapturedPointers(button);
    }
}

/**
 * Releases captured pointers belonging to a touch button.
 *
 * @param {HTMLButtonElement} button - Touch control button.
 * @returns {void}
 */
function releaseCapturedPointers(button) {
    const pointerIds = activeTouchPointers.get(button);
    if (!pointerIds) return;

    pointerIds.forEach(pointerId => {
        if (button.hasPointerCapture(pointerId)) {
            button.releasePointerCapture(pointerId);
        }
    });

    activeTouchPointers.delete(button);
}

/** @type {Map<HTMLButtonElement, Set<number>>} Active touch pointers. */
const activeTouchPointers = new Map();

/**
 * Tracks the pointer captured by a touch button.
 *
 * @param {HTMLButtonElement} button - Touch control button.
 * @param {number} pointerId - Pointer identifier.
 * @returns {void}
 */
function trackTouchPointer(button, pointerId) {
    if (!activeTouchPointers.has(button)) {
        activeTouchPointers.set(button, new Set());
    }

    activeTouchPointers.get(button).add(pointerId);
}

/**
 * Removes a released pointer from tracking.
 *
 * @param {HTMLButtonElement} button - Touch control button.
 * @param {number} pointerId - Pointer identifier.
 * @returns {void}
 */
function untrackTouchPointer(button, pointerId) {
    const pointers = activeTouchPointers.get(button);
    if (!pointers) return;

    pointers.delete(pointerId);
    if (pointers.size === 0) activeTouchPointers.delete(button);
}

window.addEventListener('blur', releaseTouchControls);
document.addEventListener('DOMContentLoaded', initializeTouchControls);
