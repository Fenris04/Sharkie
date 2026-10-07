/**
 * Stores the current state of the keyboard controls.
 */
const keyboard = {
    RIGHT: false,
    LEFT: false,
    UP: false,
    DOWN: false
};


/**
 * Marks a control as active when its key is pressed.
 *
 * @param {KeyboardEvent} event - The triggered keyboard event.
 * @returns {void}
 */
function handleKeyDown(event) {
    if (event.key === 'ArrowRight') keyboard.RIGHT = true;
    if (event.key === 'ArrowLeft') keyboard.LEFT = true;
    if (event.key === 'ArrowUp') keyboard.UP = true;
    if (event.key === 'ArrowDown') keyboard.DOWN = true;
}


/**
 * Marks a control as inactive when its key is released.
 *
 * @param {KeyboardEvent} event - The triggered keyboard event.
 * @returns {void}
 */
function handleKeyUp(event) {
    if (event.key === 'ArrowRight') keyboard.RIGHT = false;
    if (event.key === 'ArrowLeft') keyboard.LEFT = false;
    if (event.key === 'ArrowUp') keyboard.UP = false;
    if (event.key === 'ArrowDown') keyboard.DOWN = false;
}


window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);