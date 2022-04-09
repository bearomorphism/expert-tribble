var socket;

const width = 20;
const height = 15;
const gridSize = 30;

function setup() {
    createCanvas(gridSize * width, gridSize * height);
    background(0);
    socket = io.connect('http://localhost:3000');
    socket.on('mouse',
        function (data) {
            console.log("Got: " + data.x + " " + data.y);
            fill(0, 255, 0);
            noStroke();
            ellipse(data.x, data.y, 20, 20);
        }
    );
    socket.on('update', (game) => {
        background(0);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                fill(game.grids[i][j]);
                noStroke();
                rect(j * gridSize, i * gridSize, gridSize, gridSize);
            }
        }
    })
}

function draw() {
    // Nothing
}

function mouseDragged() {
    fill(255);
    noStroke();
    ellipse(mouseX, mouseY, 20, 20);
    sendmouse(mouseX, mouseY);
}

function sendmouse(xpos, ypos) {
    console.log("sendmouse: " + xpos + " " + ypos);

    var data = {
        x: xpos,
        y: ypos
    };

    socket.emit('mouse', data);
}