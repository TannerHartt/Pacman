let lastKeyPressed = ''; // To track the previously pressed key.

/**
 * This function checks collisions between two objects within the canvas and returns a boolean.
 * @param circle The circular object to track (Player).
 * @param boundary The rectangular object to track (Boundaries).
 * @returns {boolean} True if there is a collision, false otherwise.
 */
function checkCollision({ circle, boundary }) {
    return (
        circle.position.y - circle.radius + circle.velocity.y <= boundary.position.y + boundary.height &&
        circle.position.x + circle.radius + circle.velocity.x >= boundary.position.x &&
        circle.position.y + circle.radius + circle.velocity.y >= boundary.position.y &&
        circle.position.x - circle.radius + circle.velocity.x <= boundary.position.x + boundary.width)
}

/**
 * This function creates a JS image object and sets its source to the passed value.
 * @param src A string containing the image path.
 * @returns {HTMLImageElement} Image object containing the passed image source.
 */
function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

addEventListener('resize', () => {
    canvas.height = innerHeight;
    canvas.width = innerWidth;

    init();
});

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true;
            lastKeyPressed = 'w';
            break;
        case 's':
            keys.s.pressed = true;
            lastKeyPressed = 's';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKeyPressed = 'a';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKeyPressed = 'd';
            break;
    }
});
addEventListener("keyup", ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});
