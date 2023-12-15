const breakTimeAvailable = localStorage.getItem("breakTimeNext");
if (breakTimeAvailable == null) {
    localStorage.setItem("breakTimeNext", new Date(Date.now()).toJSON());
}

const breakTimeNext = Date.parse(localStorage.getItem("breakTimeNext"));
const breakTime = Date.parse(localStorage.getItem("breakTimeCurrent"));
if (Date.now() > breakTime && breakTimeNext > Date.now()) {
    alert(`This is disabled for ${Math.ceil((breakTimeNext - Date.now()) / 60000)} minutes`);
    window.location.href = "../";
}
else if (Date.now() < breakTime) {
    setTimeout(() => {
        console.error("1");
        window.location.href = "../";
    }, breakTime - Date.now());
}


window.addEventListener("DOMContentLoaded", (event) => {
    if (breakTimeNext < Date.now()) {
        const breakModal = new bootstrap.Modal('#start');
        breakModal.show();
    }
    else {
        const breakTimerEl = document.querySelector("#breakTimeLeft");
        let funcTimer = () => {
            msleft = breakTime - Date.now();
            if (msleft < 0) {
                breakTimerEl.innerHTML = "[FINISHED]";
                clearInterval(timer);
            }
            else {
                breakTimerEl.innerHTML = `[${Math.floor(msleft / 60000)}:${Math.floor((msleft / 1000) % 60).toString().padStart(2, '0')}]`;
            }
        }
        funcTimer();
        let timer = setInterval(funcTimer, 1000);
    }
});


function startBreak() {
    const timerEl = document.querySelector("#timer");
    const workTimeEl = document.querySelector("#workTime");

    let breakTimeEnd = Date.now() + (parseInt(timerEl.value) * 60 * 1000);

    localStorage.setItem("breakTimeCurrent", new Date(breakTimeEnd).toJSON());

    let nextAvailable = Date.now() + ((parseInt(timerEl.value) + parseInt(workTimeEl.value)) * 60 * 1000);

    localStorage.setItem("breakTimeNext", new Date(nextAvailable).toJSON());

    bootstrap.Modal.getInstance('#start').hide();
    setTimeout(() => {
        console.error("2");
        window.location.href = "../";
    }, breakTimeEnd - Date.now());


    const breakTimerEl = document.querySelector("#breakTimeLeft");
    let funcTimer = () => {
        msleft = breakTimeEnd - Date.now();
        if (msleft < 0) {
            breakTimerEl.innerHTML = "[FINISHED]";
            clearInterval(timer);
        }
        else {
            breakTimerEl.innerHTML = `[${Math.floor(msleft / 60000)}:${Math.floor((msleft / 1000) % 60).toString().padStart(2, '0')}]`;
        }
    }
    funcTimer();
    let timer = setInterval(funcTimer, 1000);
}



window.addEventListener("DOMContentLoaded", () => {
    var myGamePiece;

    function startGame() {
        myGamePiece = new component(20, 20, "red", 10, 120);
        myGameArea.start();
    }

    myGameArea = {
        canvas: document.querySelector("#game-canvas"),
        isMouseHover: false,
        size: 0,
        anchorOffsetX: 0,
        anchorOffsetY: 0,
        playedSticks: [],
        game: [],
        gameId: 0,
        player: 0,
        turn: 0,
        start: function () {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            this.context = this.canvas.getContext("2d");
            this.interval = setInterval(updateGameArea, 20);

            this.canvas.addEventListener("mouseleave", function (event) {
                myGameArea.isMouseHover = false
            }, false);
            this.canvas.addEventListener("mouseover", function (event) {
                myGameArea.isMouseHover = true
            }, false);
            window.addEventListener('mousemove', function (e) {
                myGameArea.x = e.offsetX;
                myGameArea.y = e.offsetY;
            });
            this.canvas.addEventListener('mousedown', function (e) {
                let col = Math.floor((myGameArea.x - myGameArea.anchorOffsetX + myGameArea.size * 3) / (myGameArea.size * 6));
                let row = Math.floor((myGameArea.y - myGameArea.anchorOffsetY + myGameArea.size * 3) / (myGameArea.size * 6));
                if (myGameArea.player === 2) {
                    let temp = row;
                    row = col;
                    col = temp;
                }
                if (myGameArea.turn == myGameArea.player && (row + col) % 2 == 0 && row > 0 && row < 10 && col > 0 && col < 10 && !myGameArea.game[row][col]) {
                    myGameArea.socket.send(JSON.stringify({row: row, col: col, gameId: myGameArea.gameId, type: "claim"}));
                }
            });
        },
        configureWebSocket: function () {
            const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
            this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
            this.socket.onopen = (event) => {
                this.socket.send(JSON.stringify({ type: "join" }));
            };
            this.socket.onmessage = async (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === "load") {
                    this.game = msg.game;
                    this.turn = msg.turn;
                    if (this.gameId === 0) {
                        this.gameId = msg.gameId;
                        this.player = msg.player;
                        startGame();
                    }

                    this.loadGame();
                }
                else if(msg.type === "game over") {
                    alert(msg.message);
                    this.turn = 0;
                }
                else {
                    console.log(msg);
                }
            };
        },
        loadGame: function () {
            clearInterval(this.interval);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.setUpAnchors();

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    let row;
                    let col;
                    if (this.player == 1) {
                        row = i;
                        col = j;
                    }
                    else {
                        row = j;
                        col = i;
                    }
                    if ((row + col) % 2 == 0 && row > 0 && row < 10 && col > 0 && col < 10 && this.game[i][j]) {
                        let curPiece;
                        if(this.game[i][j] === this.player) {
                            if (row % 2 == 1) {
                                curPiece = new component(
                                    myGameArea.size * 11,
                                    myGameArea.size,
                                    "rgb(60, 60, 255)",
                                    (col - 1) / 2 * myGameArea.size * 12 + myGameArea.anchorOffsetX + myGameArea.size,
                                    (row - 1) / 2 * myGameArea.size * 12 + myGameArea.size * 6 + myGameArea.anchorOffsetY);
                            }
                            else {
                                curPiece = new component(
                                    myGameArea.size,
                                    myGameArea.size * 11,
                                    "rgb(60, 60, 255)",
                                    (col - 1) / 2 * myGameArea.size * 12 + myGameArea.size * 6 + myGameArea.anchorOffsetX,
                                    (row - 1) / 2 * myGameArea.size * 12 + myGameArea.anchorOffsetY + myGameArea.size);
                            }
                        }
                        else {
                            if (row % 2 == 0) {
                                curPiece = new component(
                                    myGameArea.size * 11,
                                    myGameArea.size,
                                    "rgb(255, 60, 60)",
                                    (col - 1) / 2 * myGameArea.size * 12 + myGameArea.anchorOffsetX + myGameArea.size,
                                    (row - 1) / 2 * myGameArea.size * 12 + myGameArea.size * 6 + myGameArea.anchorOffsetY);
                            }
                            else {
                                curPiece = new component(
                                    myGameArea.size,
                                    myGameArea.size * 11,
                                    "rgb(255, 60, 60)",
                                    (col - 1) / 2 * myGameArea.size * 12 + myGameArea.size * 6 + myGameArea.anchorOffsetX,
                                    (row - 1) / 2 * myGameArea.size * 12 + myGameArea.anchorOffsetY + myGameArea.size);
                            }
                        }
                        curPiece.row = row;
                        curPiece.col = col;
                        curPiece.draw();
                        myGameArea.playedSticks.push(curPiece);
                    }
                }
            }

            this.interval = setInterval(updateGameArea, 20);
        },
        setUpAnchors: function () {
            let spaceAvailable = Math.floor(Math.min(this.canvas.height, this.canvas.width) / 5);
            this.size = Math.floor(spaceAvailable / 13);
            this.anchorOffsetX = (this.canvas.width - 6 * this.size * 10 - this.size) / 2;
            this.anchorOffsetY = (this.canvas.height - 6 * this.size * 10 - this.size) / 2;
            this.context.fillStyle = "rgb(60, 60, 255)";
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 5; j++) {
                    this.context.fillRect(i * this.size * 12 + this.anchorOffsetX, j * this.size * 12 + this.size * 6 + this.anchorOffsetY, this.size, this.size);
                }
            }

            this.context.fillStyle = "rgb(255, 60, 60)";
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 6; j++) {
                    this.context.fillRect(i * this.size * 12 + this.size * 6 + this.anchorOffsetX, j * this.size * 12 + this.anchorOffsetY, this.size, this.size);
                }
            }
        }
    }
    function component(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.draw = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        this.clear = function () {
            ctx = myGameArea.context;
            ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
        }
    }

    function updateGameArea() {
        myGamePiece.clear();
        myGameArea.playedSticks.forEach((stick) => stick.draw());
        if (myGameArea.isMouseHover) {
            let col = Math.floor((myGameArea.x - myGameArea.anchorOffsetX + myGameArea.size * 3) / (myGameArea.size * 6));
            let row = Math.floor((myGameArea.y - myGameArea.anchorOffsetY + myGameArea.size * 3) / (myGameArea.size * 6));
            if ((row + col) % 2 == 0 && row > 0 && row < 10 && col > 0 && col < 10 && !myGameArea.game[row][col]) {
                if (row % 2 == 1) {
                    myGamePiece = new component(
                        myGameArea.size * 11,
                        myGameArea.size,
                        "rgb(120, 120, 255)",
                        (col - 1) / 2 * myGameArea.size * 12 + myGameArea.anchorOffsetX + myGameArea.size,
                        (row - 1) / 2 * myGameArea.size * 12 + myGameArea.size * 6 + myGameArea.anchorOffsetY);
                }
                else {
                    myGamePiece = new component(
                        myGameArea.size,
                        myGameArea.size * 11,
                        "rgb(120, 120, 255)",
                        (col - 1) / 2 * myGameArea.size * 12 + myGameArea.size * 6 + myGameArea.anchorOffsetX,
                        (row - 1) / 2 * myGameArea.size * 12 + myGameArea.anchorOffsetY + myGameArea.size);
                }
                myGamePiece.row = row;
                myGamePiece.col = col;
                myGamePiece.draw();
            }

        }
        myGameArea.setUpAnchors();

    }

    myGameArea.configureWebSocket();


});