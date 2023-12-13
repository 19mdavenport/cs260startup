window.addEventListener("DOMContentLoaded", (event) => {
    const breakTimerEl = document.querySelector("#breakTimer");
    const breakTimeStore = localStorage.getItem("breakTimeNext")
    if (breakTimeStore == null) {
        breakTimerEl.innerHTML = "[READY]";
    }
    else {
        const breakTimeNext = Date.parse(breakTimeStore);
        let timer;
        let funcTimer = () => {
            msleft = breakTimeNext - Date.now();
            if (msleft < 0) {
                breakTimerEl.innerHTML = "[READY]";
                clearInterval(timer);
            }
            else {
                breakTimerEl.innerHTML = `[${Math.floor(msleft / 60000)}:${Math.floor((msleft / 1000) % 60).toString().padStart(2, '0')}]`;
            };
        }
        funcTimer();
        timer = setInterval(funcTimer, 1000);
    }

    if (sessionStorage.getItem("currentUsername") == null) {
        const loginModal = new bootstrap.Modal('#login');
        loginModal.show();
    }
    else {
        fillData();
    }
});



async function login() {
    const usernameEl = document.querySelector("#loginUsername");
    const passwordEl = document.querySelector("#loginPassword");

    const request = { username: usernameEl.value, password: passwordEl.value};

    const response = await fetch('/api/session', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
    });

    if (response.ok) {
        sessionStorage.setItem("currentUsername", usernameEl.value)

        bootstrap.Modal.getInstance('#login').hide();

        await fillData();
        await randomWord();
        await fillData();
    } else {
        const body = await response.json();
        document.querySelector("#loginError").innerHTML = `⚠ Error: ${body.msg}`;
    }
};

async function register() {
    const usernameEl = document.querySelector("#regUsername");
    const passwordEl = document.querySelector("#regPassword");
    const emailEl = document.querySelector("#regEmail");

    const request = { username: usernameEl.value, password: passwordEl.value, email: emailEl.value };

    const response = await fetch('/api/user', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
    });

    if (response.ok) {
        sessionStorage.setItem("currentUsername", usernameEl.value)

        bootstrap.Modal.getInstance('#register').hide();

        await fillData();
        await randomWord();
        await fillData();
    } else {
        const body = await response.json();
        document.querySelector("#regError").innerHTML = `⚠ Error: ${body.msg}`;
    }
}


async function randomWord() {
    let wordReponse = await fetch('https://random-word-api.vercel.app/api?words=1');
    let wordOfDay = await wordReponse.json();

    let username = sessionStorage.getItem("currentUsername")


    const request = { group: 2, name: wordOfDay[0], due: new Date(Date.now() + Math.floor(Math.random() * 897654321)) };

    const response = await fetch(`/api/task/${username}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
    });
}


async function fillData() {
    let username = sessionStorage.getItem("currentUsername");

    document.querySelector("#usernameSettings").innerHTML = username;

    const classesResponse = await fetch(`/api/group/${username}`);
    const classes = await classesResponse.json();

    const assignmentsResponse = await fetch(`/api/task/${username}`);
    const assignments = await assignmentsResponse.json();

    const projectsResponse = await fetch(`/api/project/${username}`);
    const largeAssignments = await projectsResponse.json();

    assignments.sort((a, b) => new Date(a.due) - new Date(b.due));
    largeAssignments.sort((a, b) => new Date(a.due) - new Date(b.due));

    const assignmentsEl = document.querySelector("#normalAssignmentList");
    const largeAssignmentsEl = document.querySelector("#largeAssignmentList");
    const classesEl = document.querySelector("#classes");

    assignmentsEl.innerHTML = '';
    assignments.forEach((assignment) => {
        const row = document.createElement("tr");

        const name = document.createElement("td");
        const nameText = document.createTextNode(assignment.name);
        name.appendChild(nameText);
        row.appendChild(name);

        const className = document.createElement("td");
        const classNameText = document.createTextNode((classes.find((classItem) => classItem.id == assignment.group) || { name: "Unknown" }).name);
        className.appendChild(classNameText);
        row.appendChild(className);

        const dueDate = document.createElement("td");
        let due = new Date(assignment.due);
        const dueDateText = document.createTextNode(due.toLocaleString().toString());
        dueDate.appendChild(dueDateText);
        row.appendChild(dueDate);

        if (due < Date.now()) {
            row.classList.add("table-danger");
        }
        else if (due < Date.now() + 24 * 60 * 60 * 1000) {
            row.classList.add("table-warning");
        }

        assignmentsEl.appendChild(row);
    });

    largeAssignmentsEl.innerHTML = '';
    largeAssignments.forEach((assignment) => {
        const row = document.createElement("tr");

        const name = document.createElement("td");
        const nameText = document.createTextNode(assignment.name);
        name.appendChild(nameText);
        row.appendChild(name);

        const className = document.createElement("td");
        const classNameText = document.createTextNode((classes.find((classItem) => classItem.id == assignment.group) || { name: "Unknown" }).name);
        className.appendChild(classNameText);
        row.appendChild(className);

        const timeLeft = document.createElement("td");
        const timeLeftText = document.createTextNode(assignment.hours.toString() + " Hours");
        timeLeft.appendChild(timeLeftText);
        row.appendChild(timeLeft);

        const dueDate = document.createElement("td");
        let due = new Date(assignment.due);
        const dueDateText = document.createTextNode(due.toLocaleString().toString());
        dueDate.appendChild(dueDateText);
        row.appendChild(dueDate);

        if (due < Date.now()) {
            row.classList.add("table-danger");
        }
        else if (due < Date.now() + 24 * 60 * 60 * 1000 * 7) {
            row.classList.add("table-warning");
        }

        largeAssignmentsEl.appendChild(row);
    });

    classesEl.innerHTML = '';
    classes.forEach((classItem) => {
        const row = document.createElement("tr");

        const name = document.createElement("td");
        const nameText = document.createTextNode(classItem.name);
        name.appendChild(nameText);
        row.appendChild(name);

        classesEl.appendChild(row);
    });
}