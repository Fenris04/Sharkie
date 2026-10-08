
/**
 * Stores the current keyboard controls.
 *
 * @type {{
 *     RIGHT: boolean,
 *     LEFT: boolean,
 *     UP: boolean,
 *     DOWN: boolean,
 *     SPACE: boolean,
 *     A: boolean
 * }}
 */
const keyboard = {
    RIGHT: false,
    LEFT: false,
    UP: false,
    DOWN: false,
    SPACE: false,
    A: false
};

/**
 * Maps keyboard event values to game controls.
 *
 * @type {Object<string, string>}
 */
const keyControls = {
    ArrowRight: 'RIGHT',
    ArrowLeft: 'LEFT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
    KeyA: 'A'
};

/**
 * Activates the matching control when a key is pressed.
 *
 * @param {KeyboardEvent} event - Current keyboard event.
 * @returns {void}
 */
function handleKeyDown(event) {
    updateKeyboardControl(event, true);

    if (shouldPreventScrolling(event)) {
        event.preventDefault();
    }
}

/**
 * Deactivates the matching control when a key is released.
 *
 * @param {KeyboardEvent} event - Current keyboard event.
 * @returns {void}
 */
function handleKeyUp(event) {
    updateKeyboardControl(event, false);
}

/**
 * Updates the game control matching a keyboard event.
 *
 * @param {KeyboardEvent} event - Current keyboard event.
 * @param {boolean} pressed - Whether the key is pressed.
 * @returns {void}
 */
function updateKeyboardControl(event, pressed) {
    const key = getControlKey(event);
    const control = keyControls[key];

    if (!control) return;

    keyboard[control] = pressed;
}

/**
 * Returns the event value used for game controls.
 *
 * @param {KeyboardEvent} event - Current keyboard event.
 * @returns {string} Keyboard event value.
 */
function getControlKey(event) {
    if (event.code === 'Space') return event.code;
    if (event.code === 'KeyA') return event.code;

    return event.key;
}

/**
 * Checks whether a key should prevent page scrolling.
 *
 * @param {KeyboardEvent} event - Current keyboard event.
 * @returns {boolean} True when scrolling should be prevented.
 */
function shouldPreventScrolling(event) {
    return [
        'Space',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight'
    ].includes(event.code);
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
