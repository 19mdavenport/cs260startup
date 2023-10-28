function login() {
    const usernameEl = document.querySelector("#loginUsername");
    const passwordEl = document.querySelector("#loginPassword");

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if(!users.some((u) => usernameEl.value === u.username && passwordEl.value === u.password)) {
        const errorEl = document.querySelector("#loginError");
        errorEl.innerHTML = "<p class=\"text-danger\">Incorrect username or password</p>";
        return;
    }

    sessionStorage.setItem("currentUsername", usernameEl.value)

    bootstrap.Modal.getInstance('#login').hide();
}

function register() {
    const usernameEl = document.querySelector("#regUsername");
    const passwordEl = document.querySelector("#regPassword");
    const emailEl = document.querySelector("#regEmail");
    
    const user = { username:usernameEl.value, password:passwordEl.value, email:emailEl.value };

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if(users.some((u) => user.username === u.username)) {
        const errorEl = document.querySelector("#regError");
        errorEl.innerHTML = "<p class=\"text-danger\">Username taken</p>";
        return;
    }

    users.push(user);

    sessionStorage.setItem("currentUsername", usernameEl.value)

    localStorage.setItem("registeredUsers", JSON.stringify(users));
    bootstrap.Modal.getInstance('#register').hide();
}
