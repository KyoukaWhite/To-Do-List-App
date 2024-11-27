const todoValue = document.getElementById("todoText"),
  listItems = document.getElementById("list-items"),
  addUpdateClick = document.getElementById("AddUpdateClick"),
  alertMessage = document.getElementById("AlertMessage");

let updateText;
let todoData = JSON.parse(localStorage.getItem("todoData")) || [];

// Event listener for 'Enter' key
todoValue.addEventListener("keypress", function (e) {
  SetAlertMessage("");
  if (e.key === "Enter") {
    addUpdateClick.click();
  }
});

ReadToDoItems();

function ReadToDoItems() {
  listItems.innerHTML = ""; // Clear the list before populating
  todoData.forEach((element) => {
    let li = document.createElement("li");
    let style = element.status ? 'style="text-decoration: line-through"' : "";
    const todoItems = `
      <div ${style} ondblclick="CompleteTodoItem(this)">
        ${element.item}
      </div>
      <div>
        ${style === "" ? `<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" alt="Edit"/>` : ""}
        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" alt="Delete"/>
      </div>
    `;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}

function CreateToDoData() {
  if (todoValue.value === "") {
    SetAlertMessage("Please enter your task!");
    todoValue.focus();
  } else {
    let li = document.createElement("li");
    const todoItems = `
      <div ondblclick="CompleteTodoItem(this)">
        ${todoValue.value}
      </div>
      <div>
        <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="/images/pencil.png" alt="Edit"/>
        <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="/images/delete.png" alt="Delete"/>
      </div>
    `;
    li.innerHTML = todoItems;
    listItems.appendChild(li);

    let dataItem = { item: todoValue.value, status: false };
    todoData.push(dataItem);
    setLocalStorage();

    todoValue.value = "";
    SetAlertMessage("Task added successfully!");
  }
}

function CompleteTodoItem(e) {
  if (e.style.textDecoration === "") {
    e.style.textDecoration = "line-through";
    e.parentElement.querySelector(".edit").remove();

    todoData.forEach((element) => {
      if (e.innerText.trim() === element.item) {
        element.status = true;
      }
    });
    setLocalStorage();
  }
}

function UpdateToDoItems(e) {
  let taskDiv = e.parentElement.previousElementSibling;
  if (taskDiv.style.textDecoration === "") {
    todoValue.value = taskDiv.innerText.trim();
    addUpdateClick.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdateClick.setAttribute("src", "/images/refresh.png");
    updateText = taskDiv;
  }
}

function UpdateOnSelectionItems() {
  updateText.innerText = todoValue.value;
  addUpdateClick.setAttribute("onclick", "CreateToDoData()");
  addUpdateClick.setAttribute("src", "/images/plus.png");

  todoData.forEach((element) => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });

  todoValue.value = "";
  setLocalStorage();
}

function DeleteToDoItems(e) {
  let taskText = e.parentElement.previousElementSibling.innerText.trim();
  if (confirm(`Are you sure you want to delete this task: "${taskText}"?`)) {
    e.parentElement.parentElement.remove();
    todoData = todoData.filter((element) => element.item !== taskText);
    setLocalStorage();
  }
}

function SetAlertMessage(message) {
  alertMessage.innerText = message;
  alertMessage.classList.remove("toggleMe");

  setTimeout(() => {
    alertMessage.classList.add("toggleMe");
  }, 1000);
}

function setLocalStorage() {
  localStorage.setItem("todoData", JSON.stringify(todoData));
}
