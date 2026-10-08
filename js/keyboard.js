/**
 * Stores the current keyboard controls.
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
 * Activates the matching control when a key is pressed.
 *
 * @param {KeyboardEvent} event - Current keyboard event.
 * @returns {void}
 */
function handleKeyDown(event) {
    if (event.key === 'ArrowRight') keyboard.RIGHT = true;
    if (event.key === 'ArrowLeft') keyboard.LEFT = true;
    if (event.key === 'ArrowUp') keyboard.UP = true;
    if (event.key === 'ArrowDown') keyboard.DOWN = true;
    if (event.code === 'Space') keyboard.SPACE = true;
    if (event.code === 'KeyA') keyboard.A = true;

    /**
    * Prevents page scrolling when a game control is pressed.
    */
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
        .includes(event.code)) {
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
    if (event.key === 'ArrowRight') keyboard.RIGHT = false;
    if (event.key === 'ArrowLeft') keyboard.LEFT = false;
    if (event.key === 'ArrowUp') keyboard.UP = false;
    if (event.key === 'ArrowDown') keyboard.DOWN = false;
    if (event.code === 'Space') keyboard.SPACE = false;
    if (event.code === 'KeyA') keyboard.A = false;
}


window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);