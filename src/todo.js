const submitButton = document.getElementById("submitTodo");
const containerTodos = document.getElementById("containerTodos");
let todos = [];
let index = 0;

submitButton.addEventListener("click", () => {
  const inputan = document.getElementById("inputTodo");

  if (inputan.value.trim() === "") return;

  todos.push(inputan.value);

  containerTodos.innerHTML += `
    <div class="todo flex flex-col bg-white p-3 rounded-md shadow-md">
      <div class="flex justify-between items-center mb-2">
        <h1 class="font-semibold text-sm text-gray-500">#${index + 1}</h1>
        <div class="space-x-2">
          <button class="Edit-Button text-blue-600 hover:underline">Edit</button>
          <button class="Delete-Button text-red-500 hover:underline">Delete</button>
        </div>
      </div>
      <p class="todo-text text-gray-800">${inputan.value}</p>
    </div>
  `;

  index += 1;
  inputan.value = "";
});

// 🧠 Event listener untuk tombol edit & delete
containerTodos.addEventListener("click", (event) => {
  const clicked = event.target;

  if (clicked.classList.contains("Delete-Button")) {
    const todoElement = clicked.closest(".todo");
    const todoIndex = Array.from(containerTodos.children).indexOf(todoElement);

    todos.splice(todoIndex, 1);
    todoElement.remove();
    index -= 1;

    // Opsional: bisa update ulang semua nomor kalau mau
  }

  if (clicked.classList.contains("Edit-Button")) {
    const todoElement = clicked.closest(".todo");
    const todoTextElement = todoElement.querySelector(".todo-text");
    const currentText = todoTextElement.textContent;
    const newText = prompt("Edit todo kamu:", currentText);

    if (newText !== null && newText.trim() !== "") {
      todoTextElement.textContent = newText;
      const todoIndex = Array.from(containerTodos.children).indexOf(todoElement);
      todos[todoIndex] = newText;
    }
  }
});
