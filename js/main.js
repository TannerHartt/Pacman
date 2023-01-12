const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.height = innerHeight;
canvas.width = innerWidth;

addEventListener('resize', () => {
    canvas.height = innerHeight;
    canvas.width = innerWidth;

    init();
});
addEventListener("keydown", ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
    }
});
addEventListener("keyup", ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false;
            lastKeyPressed = 'w';
            break;
        case 's':
            keys.s.pressed = false;
            lastKeyPressed = 's';
            break;
        case 'a':
            keys.a.pressed = false;
            lastKeyPressed = 'a';
            break;
        case 'd':
            keys.d.pressed = false;
            lastKeyPressed = 'd';
            break;
    }
});

class Boundary {
    static width = 40;
    static height = 40;
    constructor({position}) {
        this.position = position;
        this.width = Boundary.width;
        this.height = Boundary.height;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = 'yellow';
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

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
let lastKeyPressed = '';

const map = [
    ['-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-'],

];
let boundaries = [];
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
    boundaries = [];

}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0 , canvas.width, canvas.height);

    map.forEach((row, rowIndex) => {
        row.forEach((symbol, symbolIndex) => {
            switch (symbol) {
                case '-':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * symbolIndex,
                                y: Boundary.height * rowIndex }
                        }));
                    break;
            }
        });
    });
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    player.update();
    player.velocity.x = 0;
    player.velocity.y = 0;


    if (keys.w.pressed && lastKeyPressed === 'w') {
        player.velocity.y = -5;
    } else if (keys.a.pressed && lastKeyPressed === 'a') {
        player.velocity.x = -5;
    } else if (keys.s.pressed && lastKeyPressed === 's') {
        player.velocity.y = 5;
    } else if (keys.d.pressed && lastKeyPressed === 'd') {
        player.velocity.x = 5;
    }
}

init();
animate();