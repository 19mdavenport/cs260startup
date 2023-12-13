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
        start: function () {
            this.game = Array.from(Array(10), () => new Array(10).fill(0));
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
                if (myGameArea.isMouseHover && !myGameArea.game[myGamePiece.row][myGamePiece.col]) {
                    myGameArea.playedSticks.push(new component(myGamePiece.width, myGamePiece.height, "rgb(60, 60, 255)", myGamePiece.x, myGamePiece.y));
                    myGameArea.game[myGamePiece.row][myGamePiece.col] = 1;
                    let over = myGameArea.gameOver();
                    if (over) {
                        alert("You win!");
                        myGameArea.restartGame();
                    }
                    while (true) {
                        let row = Math.ceil(Math.random() * 10);
                        let col = Math.ceil(Math.random() * 10);
                        if ((row + col) % 2 == 0 && row > 0 && row < 10 && col > 0 && col < 10 && !myGameArea.game[row][col]) {
                            let oppPiece;
                            if (row % 2 == 0) {
                                oppPiece = new component(
                                    myGameArea.size * 11,
                                    myGameArea.size,
                                    "rgb(255, 60, 60)",
                                    (col - 1) / 2 * myGameArea.size * 12 + myGameArea.anchorOffsetX + myGameArea.size,
                                    (row - 1) / 2 * myGameArea.size * 12 + myGameArea.size * 6 + myGameArea.anchorOffsetY);
                            }
                            else {
                                oppPiece = new component(
                                    myGameArea.size,
                                    myGameArea.size * 11,
                                    "rgb(255, 60, 60)",
                                    (col - 1) / 2 * myGameArea.size * 12 + myGameArea.size * 6 + myGameArea.anchorOffsetX,
                                    (row - 1) / 2 * myGameArea.size * 12 + myGameArea.anchorOffsetY + myGameArea.size);
                            }
                            oppPiece.row = row;
                            oppPiece.col = col;
                            oppPiece.draw();
                            myGameArea.game[row][col] = 2;
                            myGameArea.playedSticks.push(oppPiece);
                            let over = myGameArea.gameOver();
                            if (over) {
                                alert("You lose!");
                                myGameArea.restartGame();
                            }
                            break;
                        }
                    }
                }
            });
            this.setUpAnchors();
        },
        restartGame: function() {
            clearInterval(this.interval);
            this.game = Array.from(Array(10), () => new Array(10).fill(0));
            this.playedSticks = [];
            this.context.clearRect(0,0,this.canvas.width, this.canvas.height);

            this.setUpAnchors();
            
            this.interval = setInterval(updateGameArea, 20);
        },
        gameOver: function () {
            debugger;
            let visited = Array.from(Array(10), () => new Array(10).fill(false));
            this.visit(1, 1, 1, visited);
            this.visit(3, 1, 1, visited);
            this.visit(5, 1, 1, visited);
            this.visit(7, 1, 1, visited);
            this.visit(9, 1, 1, visited);

            if (visited[1][9] || visited[3][9] || visited[5][9] || visited[7][9] || visited[9][9]) return 1;
            
            visited = Array.from(Array(10), () => new Array(10).fill(false));
            this.visit(1, 1, 2, visited);
            this.visit(1, 3, 2, visited);
            this.visit(1, 5, 2, visited);
            this.visit(1, 7, 2, visited);
            this.visit(1, 9, 2, visited);


            if (visited[9][1] || visited[9][3] || visited[9][5] || visited[9][7] || visited[9][9]) return 2;

            return 0;

        },
        visit: function (row, col, player, visited) {
            if (row > 9 || row < 1 || col > 9 || col < 1) return;
            if(visited[row][col]) return;
            if (this.game[row][col] != player) return;
            
            visited[row][col] = true;

            if ((player == 1 && row % 2 == 1)) {
                if (col < 8) this.visit(row, col + 2, player, visited);
                if (col > 2) this.visit(row, col - 2, player, visited);
            }
            else if (player == 2 && col % 2 == 1) {
                if (row < 8) this.visit(row + 2, col, player, visited);
                if (row > 2) this.visit(row - 2, col, player, visited);
            }
            if (col < 9 && row < 9) this.visit(row + 1, col + 1, player, visited);
            if (col < 9 && row > 1) this.visit(row + 1, col - 1, player, visited);
            if (col > 1 && row < 9) this.visit(row - 1, col + 1, player, visited);
            if (col > 1 && row > 1) this.visit(row - 1, col - 1, player, visited);

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

    startGame();

});