window.addEventListener("DOMContentLoaded", (event) => {
    const breakTimerEl = document.querySelector("#breakTimer");
    const breakTimeStore = localStorage.getItem("breakTimeNext")
    if (breakTimeStore == null) {
        breakTimerEl.innerHTML = "[READY]";
    }
    else {
        const breakTimeNext = Date.parse(breakTimeStore);
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
        let timer = setInterval(funcTimer, 1000);
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

    sessionStorage.setItem("currentUsername", usernameEl.value)

    bootstrap.Modal.getInstance('#login').hide();

    fillData();
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

    sessionStorage.setItem("currentUsername", usernameEl.value)

    bootstrap.Modal.getInstance('#register').hide();

    fillData();
}


async function fillData() {
    let username = sessionStorage.getItem("currentUsername")
    document.querySelector("#usernameSettings").innerHTML = username;

    const classesResponse = await fetch(`/api/group/${username}`);
    const classes = await classesResponse.json();

    const assignmentsResponse = await fetch(`/api/task/${username}`);
    const assignments = await assignmentsResponse.json();

    const projectsResponse = await fetch(`/api/project/${username}`);
    const largeAssignments = await projectsResponse.json();

    assignments.sort((a, b) => a.due - b.due);
    largeAssignments.sort((a, b) => a.due - b.due);

    const assignmentsEl = document.querySelector("#normalAssignmentList");
    const largeAssignmentsEl = document.querySelector("#largeAssignmentList");
    const classesEl = document.querySelector("#classes");

    debugger;
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