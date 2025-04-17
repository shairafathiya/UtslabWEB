const baseUrl = "https://api-todo-list-pbw.vercel.app";

// Loader functions
const showLoader = () => $(".loader").css("display", "block");
const hideLoader = () => $(".loader").css("display", "none");

// Message display function
const showMessage = (text, isError = false) => {
    $("#message").text(text).css("background", isError ? "rgba(255, 75, 43, 0.95)" : "rgba(75, 182, 183, 0.95)");
    $("#message").addClass("show");
    setTimeout(() => $("#message").removeClass("show"), 3000);
};

// Redirect to login if no token
if (!localStorage.getItem("token")) window.location.href = "index.html";

// Fetch all todos on page load
$(document).ready(function () {
    var todoList = $('#todo-list');
    let token = localStorage.getItem("token");

    $.ajax({
        url: `${baseUrl}/todo/getAllTodos`,
        type: 'GET',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        beforeSend: showLoader,
        success: function (response) {
            hideLoader();
            if (response.status) {
                response.data.forEach(function (data) {
                    let li = document.createElement("li");
                    li.className = `todo-item ${data.onCheckList ? 'completed' : ''}`;
                    li.innerHTML = `
                        <input type="checkbox" ${data.onCheckList ? 'checked' : ''} onchange="updateTodoCheck('${data._id}', this.checked)">
                        <span>${data.text}</span>
                        <div>
                            <button class="edit-btn" onclick="editTodo(this, '${data._id}')">Edit</button>
                            <button class="delete-btn" onclick="deleteTodo(this, '${data._id}')">Delete</button>
                        </div>
                    `;
                    todoList.append(li);
                });
            } else {
                showMessage("Error: " + response.message, true);
            }
        },
        error: function (xhr, status, error) {
            hideLoader();
            showMessage('Error: ' + (xhr.responseJSON?.message || xhr.statusText), true);
        }
    });
});

// Add Todo
function addTodo() {
    let todo = $("#todo-input").val();
    let token = localStorage.getItem("token");

    if (!todo) {
        showMessage("Todo cannot be empty!", true);
        return;
    }

    $.ajax({
        url: `${baseUrl}/todo/createTodo`,
        type: 'POST',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        contentType: "application/json",
        data: JSON.stringify({
            text: todo
        }),
        beforeSend: function () {
            showLoader();
            $("#btn-tambah").text("Please wait...");
        },
        success: function (response) {
            hideLoader();
            $("#btn-tambah").text("Add Todo");
            if (response.status) {
                let li = document.createElement("li");
                li.className = "todo-item";
                li.innerHTML = `
                    <input type="checkbox" onchange="updateTodoCheck('${response.data._id}', this.checked)">
                    <span>${todo}</span>
                    <div>
                        <button class="edit-btn" onclick="editTodo(this, '${response.data._id}')">Edit</button>
                        <button class="delete-btn" onclick="deleteTodo(this, '${response.data._id}')">Delete</button>
                    </div>
                `;
                $("#todo-list").append(li);
                $("#todo-input").val('');
                showMessage("Todo created successfully!");
            } else {
                showMessage("Error: " + response.message, true);
            }
        },
        error: function (xhr, status, error) {
            hideLoader();
            $("#btn-tambah").text("Add Todo");
            showMessage('Error: ' + (xhr.responseJSON?.message || xhr.statusText), true);
        }
    });
}

// Update Todo Check Status
function updateTodoCheck(id, onCheckList) {
    let token = localStorage.getItem("token");
    let li = $(`input[onchange="updateTodoCheck('${id}', this.checked)"]`).closest("li");
    let text = li.find("span").text();

    $.ajax({
        url: `${baseUrl}/todo/updateTodo/${id}`,
        type: 'PUT',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        contentType: "application/json",
        data: JSON.stringify({
            text: text,
            onCheckList: onCheckList
        }),
        beforeSend: showLoader,
        success: function (response) {
            hideLoader();
            if (response.status) {
                li.toggleClass("completed", onCheckList);
                showMessage("Todo updated successfully!");
            } else {
                showMessage("Error: " + response.message, true);
            }
        },
        error: function (xhr, status, error) {
            hideLoader();
            showMessage('Error: ' + (xhr.responseJSON?.message || xhr.statusText), true);
        }
    });
}

// Edit Todo
function editTodo(button, id) {
    if (!id) {
        showMessage("ID not found!", true);
        return;
    }
    let li = $(button).closest("li");
    let span = li.find("span");
    let currentText = span.text();

    span.html(`<input type="text" value="${currentText}" />`);
    button.textContent = "Save";
    button.setAttribute("onclick", `saveTodo(this, '${id}')`);
}

// Save Todo (after editing)
function saveTodo(button, id) {
    let li = $(button).closest("li");
    let input = li.find("input[type='text']");
    let newText = input.val().trim();
    let token = localStorage.getItem("token");
    let onCheckList = li.find("input[type='checkbox']").is(":checked");

    if (!newText) {
        showMessage("Todo cannot be empty!", true);
        return;
    }

    $.ajax({
        url: `${baseUrl}/todo/updateTodo/${id}`,
        type: 'PUT',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        contentType: "application/json",
        data: JSON.stringify({
            text: newText,
            onCheckList: onCheckList
        }),
        beforeSend: function () {
            showLoader();
            button.textContent = "Please wait...";
        },
        success: function (response) {
            hideLoader();
            if (response.status) {
                li.find("span").text(newText);
                button.textContent = "Edit";
                button.setAttribute("onclick", `editTodo(this, '${id}')`);
                showMessage("Todo updated successfully!");
            } else {
                showMessage("Error: " + response.message, true);
            }
        },
        error: function (xhr, status, error) {
            hideLoader();
            button.textContent = "Edit";
            showMessage('Error: ' + (xhr.responseJSON?.message || xhr.statusText), true);
        }
    });
}

// Delete Todo
function deleteTodo(button, id) {
    let token = localStorage.getItem("token");

    if (!id) {
        showMessage("ID not found!", true);
        return;
    }

    $.ajax({
        url: `${baseUrl}/todo/deleteTodo/${id}`,
        type: 'DELETE',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        beforeSend: showLoader,
        success: function (response) {
            hideLoader();
            if (response.status) {
                $(button).closest("li").remove();
                showMessage("Todo deleted successfully!");
            } else {
                showMessage("Error: " + response.message, true);
            }
        },
        error: function (xhr, status, error) {
            hideLoader();
            showMessage('Error: ' + (xhr.responseJSON?.message || xhr.statusText), true);
        }
    });
}

// Logout
function logout() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
        showMessage("User ID not found", true);
        return;
    }

    $.ajax({
        url: `${baseUrl}/auth/logout/${userId}`,
        type: 'POST',
        dataType: "json",
        headers: {
            Authorization: `Bearer ${token}`
        },
        beforeSend: showLoader,
        success: function (response) {
            hideLoader();
            if (response.status) {
                localStorage.clear();
                showMessage("Logged out successfully!");
                setTimeout(() => {
                    window.location.replace("index.html");
                }, 1000);
            } else {
                showMessage("Logout failed: " + response.message, true);
            }
        },
        error: function (xhr, status, error) {
            hideLoader();
            showMessage('Error: ' + (xhr.responseJSON?.message || xhr.statusText), true);
        }
    });
}
