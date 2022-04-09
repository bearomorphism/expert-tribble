import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + '/public'));

function makeArray(w, h, val) {
    var arr = [];
    for (let i = 0; i < h; i++) {
        arr[i] = [];
        for (let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}

var players = {};
var n = 0;

const width = 20;
const height = 15;

class Player {
    constructor(_id, pos) {
        this.id = _id;
        this.status = 'connected';
        this.score = 0;
        this.direction = 0;
        this.pos = pos;
        this.color = [255, 255, 255];
    }

    ready() {
        this.status = 'ready';
    }
}

var game = {
    scores: [0, 0],
    grids: makeArray(width, height, [0, 0, 0]),
};

io.on("connection", (socket) => {
    console.log("We have a new client: " + socket.id);
    players[socket.id] = new Player(socket.id, [n * 5, 0]);
    n++;

    socket.on('ready', () => {
        players[socket.id].ready();
    })

    socket.on('change direction', (direction) => {
        players[socket.id].direction = direction;
    })

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} has disconnected`);
        delete players[socket.id];
        console.log(players);
    });

    setInterval(() => {
        update();
        socket.emit('update', game);
    }, 1000);
});

const moves = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
];

function update() {
    Object.entries(players).forEach(([key, value]) => {
        const move = moves[value.direction];
        console.log(move);
        const updatedPosition = [value.pos[0] + move[0], value.pos[1] + move[1]];
        players[key].pos = updatedPosition;
        game.grids[updatedPosition[0]][updatedPosition[1]] = value.color;
    });
}

httpServer.listen(3000);