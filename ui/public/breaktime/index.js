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
