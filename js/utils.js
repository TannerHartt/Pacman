let lastKeyPressed = ''; // To track the previously pressed key.

/**
 * This function checks collisions between two objects within the canvas and returns a boolean.
 * @param circle The circular object to track (Player or Ghost).
 * @param boundary The rectangular object to track (Boundaries).
 * @returns {boolean} True if there is a collision, false otherwise.
 */
function checkCollision({ circle, boundary }) {
    const padding = Boundary.width / 2 - circle.radius - 2;
    return (
        circle.position.y - circle.radius + circle.velocity.y <= boundary.position.y + boundary.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= boundary.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= boundary.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= boundary.position.x + boundary.width + padding)
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

/**
 * This function takes in a map design in the form of a 2D array and parses each element and
 * decodes the symbols it contains - drawing the corresponding map junction piece image.
 * @param map 2D array containing symbols indicating the map design and food pellets.
 */
function generateMap(map) {
    // Procedurally generate map.
    map.forEach((row, rowIndex) => { // Each row in the grid
        row.forEach((symbol, symbolIndex) => { // Each column in the grid
            switch (symbol) { // Load a different image depending on the grid symbol.
                case '-':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeHorizontal.png')
                        })
                    );
                    break; // Horizontal pipe
                case '|':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeVertical.png')
                        })
                    );
                    break; // Vertical pipe
                case '1':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeCorner1.png')
                        })
                    );
                    break; // Top left corner
                case '2':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeCorner2.png')
                        })
                    );
                    break; // Top right corner
                case '3':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeCorner3.png')
                        })
                    );
                    break; // Bottom right corner
                case '4':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeCorner4.png')
                        })
                    );
                    break; // Bottom left corner
                case 'b':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/block.png')
                        })
                    );
                    break; // 4-sided block
                case '[':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/capLeft.png')
                        })
                    );
                    break; // Left cap
                case ']':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/capRight.png')
                        })
                    );
                    break; // Right cap
                case 'u':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/capBottom.png')
                        })
                    );
                    break; // Bottom cap
                case 'n':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/capTop.png')
                        })
                    );
                    break; // Top cap
                case '+':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeCross.png')
                        })
                    );
                    break; // 4-way cross-section
                case '_':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeConnectorTop.png')
                        })
                    );
                    break; // 3-way upward facing edge pipe
                case '^':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeConnectorBottom.png')
                        })
                    );
                    break; // 3-way downward facing edge pipe
                case '<':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeConnectorRight.png')
                        })
                    );
                    break; // 3-way right facing edge pipe
                case '>':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex
                            },
                            image: createImage('./img/pipeConnectorLeft.png')
                        })
                    );
                    break; // 3-wy left facing edge pipe
                case '.':
                    pellets.push(
                        new Pellet({
                            position: {
                                x: symbolIndex * Boundary.width + Boundary.width / 2,
                                y: rowIndex * Boundary.height + Boundary.height / 2
                            }
                        })
                    );
                    break; // Food pellet
            }
        });
    });
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

