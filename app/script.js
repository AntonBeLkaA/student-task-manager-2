const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const formHeading = document.querySelector("#form-heading");
const errorMessage = document.querySelector("#error-message");
const filterSelect = document.querySelector("#status-filter");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const taskCount = document.querySelector("#task-count");

// 1. Дані поточної сесії: після перезавантаження зникають.
let tasks = [];
let nextId = 1;
let editingId = null;

// 2. Допоміжні функції.
function makeButton(text, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.addEventListener("click", action);
  return button;
}

function resetForm() {
  form.reset();
  editingId = null;
  formHeading.textContent = "Нове завдання";
  submitButton.textContent = "Додати";
  cancelButton.hidden = true;
  errorMessage.textContent = "";
}

function startEditing(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  editingId = id;
  titleInput.value = task.title;
  formHeading.textContent = "Редагування завдання";
  submitButton.textContent = "Зберегти зміни";
  cancelButton.hidden = false;
  errorMessage.textContent = "";
  titleInput.focus();
}

function deleteTask(id) {
  tasks = tasks.filter((item) => item.id !== id);
  if (editingId === id) resetForm();
  renderTasks();
}

// 3. Відображення даних з урахуванням фільтра.
function renderTasks() {
  const filter = filterSelect.value;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  taskList.replaceChildren();
  taskCount.textContent = `Усього завдань: ${tasks.length}`;
  emptyMessage.hidden = visibleTasks.length > 0;
  emptyMessage.textContent = tasks.length === 0
    ? "Завдань поки немає."
    : "Немає завдань для вибраного фільтра.";

  for (const task of visibleTasks) {
    const row = document.createElement("li");
    row.className = task.completed ? "task completed" : "task";

    const info = document.createElement("div");
    const title = document.createElement("strong");
    title.className = "task-title";
    title.textContent = task.title;

    const status = document.createElement("p");
    status.textContent = task.completed ? "Виконане" : "Активне";
    info.append(title, status);

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(
      makeButton(task.completed ? "Повернути" : "Виконати", () => {
        task.completed = !task.completed;
        renderTasks();
      }),
      makeButton("Редагувати", () => startEditing(task.id)),
      makeButton("Видалити", () => deleteTask(task.id))
    );

    row.append(info, actions);
    taskList.append(row);
  }
}

// 4. Створення або редагування.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();

  if (!title) {
    errorMessage.textContent = "Уведіть назву, а не лише пробіли.";
    titleInput.focus();
    return;
  }

  if (editingId === null) {
    tasks.push({ id: nextId++, title, completed: false });
    filterSelect.value = "all";
  } else {
    const task = tasks.find((item) => item.id === editingId);
    if (!task) {
      resetForm();
      return;
    }
    task.title = title;
  }

  resetForm();
  renderTasks();
});

// 5. Решта подій та початковий показ.
cancelButton.addEventListener("click", resetForm);
filterSelect.addEventListener("change", renderTasks);
titleInput.addEventListener("input", () => {
  errorMessage.textContent = "";
});

renderTasks();