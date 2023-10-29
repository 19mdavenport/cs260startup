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

    var myGameArea = {
        canvas: document.querySelector("#game-canvas"),
        isMouseHover: false,
        start: function () {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            //this.canvas.style.cursor = "none"; //hide the original cursor
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
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.setUpAnchors();
        },
        setUpAnchors: function () {
            let spaceAvailable = Math.floor(Math.min(this.canvas.height, this.canvas.width)/5);
            let size = Math.floor(spaceAvailable / 13);
            let anchorOffsetX = (this.canvas.width - 6 * size * 10 - size) / 2;
            let anchorOffsetY = (this.canvas.height - 6 * size * 10 - size) / 2;
            for(let i = 0; i < 6; i++) {
                for(let j = 0; j < 5; j++) {
                    this.context.fillStyle = "white";
                    this.context.fillRect(i * size * 12 + anchorOffsetX, j * size * 12 + size * 6 + anchorOffsetY, size, size);
                }
            }

            for(let i = 0; i < 5; i++) {
                for(let j = 0; j < 6; j++) {
                    this.context.fillStyle = "white";
                    this.context.fillRect(i * size * 12 + size * 6 + anchorOffsetX, j * size * 12 + anchorOffsetY, size, size);
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
        this.update = function () {
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    function updateGameArea() {
        myGameArea.clear();
        if (myGameArea.isMouseHover) {
            myGamePiece.x = myGameArea.x;
            myGamePiece.y = myGameArea.y;
            myGamePiece.update();
        }
        
    }

    startGame();

});