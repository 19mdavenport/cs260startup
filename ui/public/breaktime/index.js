const breakTimeAvailable = localStorage.getItem("breakTimeNext");
if (breakTimeAvailable == null) {
    localStorage.setItem("breakTimeNext", new Date(Date.now()).toJSON());
}

const breakTime = Date.parse(localStorage.getItem("breakTimeNext"));
if (breakTime > Date.now()) {
    alert(`This is disabled for ${Math.ceil((breakTime - Date.now()) / 60000)} minutes`);
    window.location.href = "../";
}

