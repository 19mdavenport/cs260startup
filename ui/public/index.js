function login() {
    const usernameEl = document.querySelector("#loginUsername");
    const passwordEl = document.querySelector("#loginPassword");

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if (!users.some((u) => usernameEl.value === u.username && passwordEl.value === u.password)) {
        const errorEl = document.querySelector("#loginError");
        errorEl.innerHTML = "<p class=\"text-danger\">Incorrect username or password</p>";
        return;
    }

    sessionStorage.setItem("currentUsername", usernameEl.value)

    bootstrap.Modal.getInstance('#login').hide();
    
    fillData();
}

function register() {
    const usernameEl = document.querySelector("#regUsername");
    const passwordEl = document.querySelector("#regPassword");
    const emailEl = document.querySelector("#regEmail");

    const user = { username: usernameEl.value, password: passwordEl.value, email: emailEl.value };

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if (users.some((u) => user.username === u.username)) {
        const errorEl = document.querySelector("#regError");
        errorEl.innerHTML = "<p class=\"text-danger\">Username taken</p>";
        return;
    }

    users.push(user);

    sessionStorage.setItem("currentUsername", usernameEl.value)

    localStorage.setItem("registeredUsers", JSON.stringify(users));
    bootstrap.Modal.getInstance('#register').hide();

    fillData();
}


function fillData() {
    document.querySelector("#usernameSettings").innerHTML = sessionStorage.getItem("currentUsername");

    const classes = [{ id: 1, name: "CS 260" }, { id: 2, name: "[Class Name]" }];

    const assignments = [{ id: 1, class: 1, name: "Startup HTML", due: new Date(2023, 8, 30, 23, 59, 0, 0) },
    { id: 2, class: 2, name: "Item 2", due: new Date(2023, 9, 30, 23, 59, 0, 0) },
    { id: 3, class: 2, name: "Item 3", due: new Date(2023, 9, 31, 23, 59, 0, 0) },
    { id: 4, class: 2, name: "Item 4", due: new Date(2023, 10, 1, 23, 59, 0, 0) },
    { id: 5, class: 2, name: "Item 5", due: new Date(2023, 10, 2, 23, 59, 0, 0) },
    { id: 6, class: 2, name: "Item 6", due: new Date(2023, 10, 3, 23, 59, 0, 0) },
    { id: 7, class: 2, name: "Item 7", due: new Date(2023, 10, 4, 23, 59, 0, 0) },
    { id: 8, class: 2, name: "Item 8", due: new Date(2023, 10, 5, 23, 59, 0, 0) }];

    const largeAssignments = [{ id: 1, class: 1, name: "Startup HTML", hours: 3, due: new Date(2023, 9, 28, 23, 59, 0, 0) },
    { id: 2, class: 2, name: "Item 2", hours: 2, due: new Date(2023, 10, 3, 23, 59, 0, 0) },
    { id: 3, class: 2, name: "Item 3", hours: 13, due: new Date(2023, 10, 5, 23, 59, 0, 0) },
    { id: 4, class: 2, name: "Item 4", hours: 4, due: new Date(2023, 10, 7, 23, 59, 0, 0) },
    { id: 5, class: 2, name: "Item 5", hours: 7, due: new Date(2023, 10, 9, 23, 59, 0, 0) },
    { id: 6, class: 2, name: "Item 6", hours: 23, due: new Date(2023, 10, 11, 23, 59, 0, 0) }];

    assignments.sort((a, b) => a.due - b.due);
    largeAssignments.sort((a, b) => a.due - b.due);

    const assignmentsEl = document.querySelector("#normalAssignmentList");
    const largeAssignmentsEl = document.querySelector("#largeAssignmentList");
    const classesEl = document.querySelector("#classes")

    assignmentsEl.innerHTML = '';
    assignments.forEach((assignment) => {
        const row = document.createElement("tr");

        const name = document.createElement("td");
        const nameText = document.createTextNode(assignment.name);
        name.appendChild(nameText);
        row.appendChild(name);

        const className = document.createElement("td");
        const classNameText = document.createTextNode((classes.find((classItem) => classItem.id == assignment.class) || {name:"Unknown"}).name);
        className.appendChild(classNameText);
        row.appendChild(className);

        const dueDate = document.createElement("td");
        const dueDateText = document.createTextNode(assignment.due.toLocaleString().toString());
        dueDate.appendChild(dueDateText);
        row.appendChild(dueDate);

        if(assignment.due < Date.now()) {
            row.classList.add("table-danger");
        }
        else if(assignment.due < Date.now() + 24 * 60 * 60 * 1000) {
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
        const classNameText = document.createTextNode((classes.find((classItem) => classItem.id == assignment.class) || {name:"Unknown"}).name);
        className.appendChild(classNameText);
        row.appendChild(className);

        const timeLeft = document.createElement("td");
        const timeLeftText = document.createTextNode(assignment.hours.toString() + " Hours");
        timeLeft.appendChild(timeLeftText);
        row.appendChild(timeLeft);

        const dueDate = document.createElement("td");
        const dueDateText = document.createTextNode(assignment.due.toLocaleString().toString());
        dueDate.appendChild(dueDateText);
        row.appendChild(dueDate);

        if(assignment.due < Date.now()) {
            row.classList.add("table-danger");
        }
        else if(assignment.due < Date.now() + 24 * 60 * 60 * 1000 * 7) {
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