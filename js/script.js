// --- متغیرهای اصلی ---
let todos = [];
let editId = null;
let currentFilter = "all";

const todoInput = document.getElementById("todoInput");
const todoDate = document.getElementById("todoDate");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");
const clearAllBtn = document.getElementById("clearAllBtn");
const toast = document.getElementById("toast");

const filterBtns = document.querySelectorAll(".filter-btn");

// --- Toast پیام بالا ---
function showToast(message, color = "#667eea") {
  toast.textContent = message;
  toast.style.background = color;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// --- بارگذاری از localStorage ---
function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (saved) todos = JSON.parse(saved);
}

// --- ذخیره در localStorage ---
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// --- افزودن یا ویرایش تسک ---
function addTodo() {
  const text = todoInput.value.trim();
  const date = todoDate.value;

  if (text === "") return;

  if (editId) {
    // ویرایش
    todos = todos.map((t) =>
      t.id === editId ? { ...t, text, date } : t
    );
    editId = null;
    addBtn.textContent = "Add";
    showToast("✅ Task updated successfully!", "#4dabf7");
  } else {
    // افزودن جدید
    const newTodo = {
      id: Date.now(),
      text,
      date,
      completed: false,
    };
    todos.push(newTodo);
    showToast("🎉 Task added successfully!", "#51cf66");
  }

  saveTodos();
  todoInput.value = "";
  todoDate.value = "";
  renderTodos();
}

// --- حذف تسک ---
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderTodos();
}

// --- تغییر وضعیت انجام شده ---
function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos();
  renderTodos();
}

// --- پاک کردن همه ---
function clearAllTodos() {
  todos = [];
  saveTodos();
  renderTodos();
}

// --- رندر کردن لیست ---
function renderTodos() {
  todoList.innerHTML = "";

  let filtered = todos;
  if (currentFilter === "active") filtered = todos.filter(t => !t.completed);
  if (currentFilter === "completed") filtered = todos.filter(t => t.completed);

  if (filtered.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">No tasks found!</div>
      </div>`;
  } else {
    filtered.forEach(todo => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;
      li.innerHTML = `
        <input type="checkbox" class="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}">
        <span class="todo-text">${todo.text}</span>
        <span class="todo-date">${todo.date ? todo.date : ""}</span>
        <button class="edit-btn" data-id="${todo.id}">Edit</button>
        <button class="delete-btn" data-id="${todo.id}">Delete</button>
      `;
      todoList.appendChild(li);
    });
  }

  updateStats();
  updateFilterUI();
}

// --- آمار ---
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;

  totalCount.textContent = total;
  activeCount.textContent = active;
  completedCount.textContent = completed;

  clearAllBtn.disabled = total === 0;
}

// --- آپدیت ظاهر دکمه‌های فیلتر ---
function updateFilterUI() {
  filterBtns.forEach(btn => btn.classList.remove("active"));
  document.querySelector(`[data-filter="${currentFilter}"]`).classList.add("active");
}

// --- رویدادها ---
addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

todoList.addEventListener("click", (e) => {
  const id = parseInt(e.target.dataset.id);
  if (e.target.classList.contains("checkbox")) {
    toggleTodo(id);
  } else if (e.target.classList.contains("delete-btn")) {
    deleteTodo(id);
  } else if (e.target.classList.contains("edit-btn")) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todoInput.value = todo.text;
      todoDate.value = todo.date || "";
      editId = id;
      addBtn.textContent = "Update";
    }
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

clearAllBtn.addEventListener("click", clearAllTodos);

// --- اجرا ---
loadTodos();
renderTodos();
