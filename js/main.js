const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreEl');

canvas.height = innerHeight;
canvas.width = innerWidth;

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
const map1 = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '^', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', 'u', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', 'n', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', 'u', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', 'n', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '_', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
];

let animationId;
let boundaries = [];
let pellets = [];
let score = 0;
let ghosts = [];
let powerUps = [];

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


function init() {
    // Reset variables
    boundaries = [];
    pellets = [];
    powerUps = [];
    ghosts = [
        new Ghost({
            position: {
                x: (Boundary.width * 6) + Boundary.width / 2,
                y: Boundary.height + Boundary.height / 2
            },
            velocity: {
                x: Ghost.speed,
                y: 0
            }
        }),
        new Ghost({
            position: {
                x: (Boundary.width * 6) + Boundary.width / 2,
                y: (Boundary.height * 5) + Boundary.height / 2
            },
            velocity: {
                x: Ghost.speed,
                y: 0
            },
            color: 'pink'
        })
    ];
    score = 0;

    generateMap(map1);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0 , canvas.width, canvas.height);

    // Dynamic key listeners to support multiple buttons pressed.
    // Continuously checks collisions while key is pressed.
    if (keys.w.pressed && lastKeyPressed === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]; // Current boundary

            // Player and boundary collision
            if (checkCollision({
                circle: {
                    ...player,
                    velocity: {
                        x: 0,
                        y: -Player.speed
                    }
                },
                boundary: boundary
            })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = -Player.speed;
            }
        }

    } else if (keys.a.pressed && lastKeyPressed === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]; // Current boundary

            // If there is a collision
            if (checkCollision({
                circle: {
                    ...player,
                    velocity: {
                        x: -Player.speed,
                        y: 0
                    }
                },
                boundary: boundary
            })) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = -Player.speed;
            }
        }

    } else if (keys.s.pressed && lastKeyPressed === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]; // Current boundary

            // If there is a player - boundary collision.
            if (checkCollision({
                circle: {
                    ...player,
                    velocity: {
                        x: 0,
                        y: Player.speed
                    }
                },
                boundary: boundary
            })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = Player.speed;
            }
        }
        
    } else if (keys.d.pressed && lastKeyPressed === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]; // Current boundary

            if (checkCollision({
                circle: {
                    ...player,
                    velocity: {
                        x: Player.speed,
                        y: 0
                    }
                },
                boundary: boundary
                })
            ) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = Player.speed;
            }
        }
    }

    // Detect collision between ghost and player
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const ghost = ghosts[i]; // Individual ghost

        // Game over, ghost touches player
        if (Math.hypot( // Collision detection for circular objects
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y) < player.radius + ghost.radius
        ) {
            if (ghost.scared) {
                ghosts.splice(i, 1);
            } else {
                cancelAnimationFrame(animationId);
            }
        }
    }


    // Animating power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        powerUp.draw();

        // Circle to circle collision detection (player - pellet).
        if (Math.hypot( // Player collides with power-up
            powerUp.position.x - player.position.x,
            powerUp.position.y - player.position.y) < player.radius + powerUp.radius
        ) {
            powerUps.splice(i, 1); // Remove it from computation

            // Make ghosts scared.
            ghosts.forEach(ghost => {
               ghost.scared = true;
               setTimeout(() => {
                   ghost.scared = false;
               }, 6000); // 6s
            });

        }
    }

    // Animating pellets
    for (let i = pellets.length - 1; i >= 0; i--) {
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

    // Win condition
    if (pellets.length === 0) { // Player collects all pellets
        setTimeout(() => {
            cancelAnimationFrame(animationId); // Stop animation;
        }, 500); // .5s after player collects all pellets.
    }

    // Looping through all the boundaries and drawing them onto the canvas.
    boundaries.forEach((boundary) => {
        boundary.draw(); // Draw each individual boundary object onto the canvas.

        // Player and boundary collision detection
        if (checkCollision({ circle: player, boundary: boundary })) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    });

    player.update();

    ghosts.forEach((ghost) => {
        ghost.update();

        const collisions = [];

        boundaries.forEach((boundary) => {

            // Ghost collides with boundary
            if (!collisions.includes('right') &&
                checkCollision({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    boundary: boundary
            })) {
                collisions.push('right');
            }
            if (!collisions.includes('left') &&
                checkCollision({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    boundary: boundary
            })) {
                collisions.push('left');
            }
            if (!collisions.includes('up') &&
                checkCollision({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    boundary: boundary
            })) {
                collisions.push('up');
            }
            if (!collisions.includes('down') &&
                checkCollision({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    boundary: boundary
            })) {
                collisions.push('down');
            }
        });


        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions;
        }

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right');
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left');
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up');
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down');


            let pathways = ghost.prevCollisions.filter(collision => {
                return !collisions.includes(collision);
            });

            let direction = pathways[Math.floor(Math.random() * pathways.length)];

            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'up':
                    ghost.velocity.y = -ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'left':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = -ghost.speed;
                    break;
                case 'right':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = ghost.speed;
                    break;
            }
            ghost.prevCollisions = []; // Resetting the values after each iteration for the next iteration

        }
    });

    // Rotates the player animation to the direction its moving.
    if (player.velocity.x > 0) {
        player.rotation = 0;
    } else if (player.velocity.x < 0) {
        player.rotation = Math.PI;
    } else if (player.velocity.y > 0) {
        player.rotation = Math.PI / 2;
    } else if (player.velocity.y < 0) {
        player.rotation = Math.PI * 1.5;
    }

} // End of animate

init();
animate();
