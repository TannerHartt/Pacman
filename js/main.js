const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreEl');

canvas.height = innerHeight;
canvas.width = innerWidth;

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


const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

// Map structure to be generated.
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '^', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', 'u', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', 'n', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', 'u', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', 'n', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '_', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
];

let boundaries = [];
let pellets = [];
let lastKeyPressed = ''; // To track the previously pressed key.
let score = 0;
let ghosts = [];


const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
     velocity: {
        x: 0,
        y: 0
     }
});

/**
 * This function checks collisions between two objects within the canvas and returns a boolean.
 * @param circle The circular object to track (Player).
 * @param boundary The rectangular object to track (Boundaries).
 * @returns {boolean} True if there is a collision, false otherwise.
 */
function playerCollidesWithBoundary({ circle, boundary }) {
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


function init() {
    // Reset variables
    boundaries = [];
    pellets = [];
    score = 0;

    // Procedurally generate map.
    map.forEach((row, rowIndex) => { // Each column in the grid
        row.forEach((symbol, symbolIndex) => { // Each row in the grid
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
                case '.':
                    pellets.push(
                        new Pellet({
                            position: {
                                x: symbolIndex * Boundary.width + Boundary.width / 2,
                                y: rowIndex * Boundary.height + Boundary.height / 2
                            }
                        })
                    );
                    break;
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0 , canvas.width, canvas.height);

    // Dynamic key listeners to support multiple buttons pressed.
    // Continuously checks collisions while key is pressed.
    if (keys.w.pressed && lastKeyPressed === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]; // Current boundary

            // Player and boundary collision
            if (playerCollidesWithBoundary({circle: {...player, velocity: { x: 0, y: -5 }}, boundary: boundary})) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = -5;
            }
        }

    } else if (keys.a.pressed && lastKeyPressed === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]; // Current boundary

            // If there is a collision
            if (playerCollidesWithBoundary({
                circle: {
                    ...player,
                    velocity: {
                        x: -5,
                        y: 0
                    }
                },
                boundary: boundary
            })) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = -5;
            }
        }

    } else if (keys.s.pressed && lastKeyPressed === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]; // Current boundary

            // If there is a player - boundary collision.
            if (playerCollidesWithBoundary({
                circle: {
                    ...player,
                    velocity: {
                        x: 0,
                        y: 5
                    }
                },
                boundary: boundary
            })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = 5;
            }
        }
        
    } else if (keys.d.pressed && lastKeyPressed === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]; // Current boundary

            if (playerCollidesWithBoundary({
                circle: {
                    ...player,
                    velocity: {
                        x: 5,
                        y: 0
                    }
                },
                boundary: boundary
                })
            ) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = 5;
            }
        }
    }

    // Animating pellets
    for (let i = pellets.length - 1; i > 0; i--) {
        const pellet = pellets[i];
        pellet.draw();

        // Circle to circle collision detection (player - pellet).
        if (Math.hypot(
            pellet.position.x - player.position.x,
            pellet.position.y - player.position.y) < player.radius + pellet.radius
        ) {
            pellets.splice(i, 1);
            score += 5;
            scoreEl.innerHTML = score;
        }
    }

    // Looping through all the boundaries and drawing them onto the canvas.
    boundaries.forEach((boundary) => {
        boundary.draw();

        // Player and boundary collision detection
        if (playerCollidesWithBoundary({ circle: player, boundary: boundary })) {

            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    });

    player.update();
}

init();
animate();
