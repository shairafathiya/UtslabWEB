const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");
const baseUrl = "https://api-todo-list-pbw.vercel.app";

// Toggle between login and register panels
registerButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

// REGISTRATION
$("#registerForm").on("submit", function (event) {
    event.preventDefault();
    const registerMessage = $(this).find(".message");

    var fullname = $("#regFullname").val();
    var email = $("#regEmail").val();
    var password = $("#regPassword").val();

    if (!fullname || !email || !password) {
        registerMessage.text("All fields are required!");
        return;
    }

    $.ajax({
        url: `${baseUrl}/auth/register`,
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            fullName: fullname,
            password: password
        }),
        beforeSend: function () {
            $("#btn-regis").text("Please wait...");
        },
        success: function (response) {
            $("#btn-regis").text("Register");
            registerMessage.text("Registration successful! Please login.");
            setTimeout(() => {
                container.classList.remove("right-panel-active");
            }, 1000);
        },
        error: function (xhr, status, error) {
            $("#btn-regis").text("Register");
            registerMessage.text('Registration failed: ' + (xhr.responseJSON?.message || xhr.statusText));
        }
    });
});

// LOGIN
$("#loginForm").on("submit", function (event) {
    event.preventDefault();
    const loginMessage = $(this).find(".message");

    var email = $("#email").val();
    var password = $("#password").val();

    if (!email || !password) {
        loginMessage.text("Email and password are required!");
        return;
    }

    $.ajax({
        url: `${baseUrl}/auth/login`,
        type: 'POST',
        dataType: 'json',
        data: {
            email: email,
            password: password
        },
        beforeSend: function () {
            $("#button-login").text("Please wait...");
        },
        success: function (response) {
            $("#button-login").text("Login");
            if (response.status) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("userId", response.data._id || response.data.userId); // Adjust based on API response
                loginMessage.text("Login successful!");
                setTimeout(() => {
                    window.location.replace("todo.html");
                }, 2000);
            } else {
                loginMessage.text("Login failed: " + response.message);
            }
        },
        error: function (xhr, status, error) {
            $("#button-login").text("Login");
            loginMessage.text('Error: ' + (xhr.responseJSON?.message || xhr.statusText));
        }
    });
});
