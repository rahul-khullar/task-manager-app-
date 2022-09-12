/*
    Glue B/w View and Model
    Controller Doing DOM
    Input , Output
*/
window.addEventListener("load", init);
var incNumber;
function init() {
  bindEvents();
  countUpdate();
  //incNumber = initCount();
  incNumber = autoInc();
  printId();
}

const printId = () =>
  //(document.querySelector("#id").innerText = incNumber());
  (document.querySelector("#id").innerText = incNumber.next().value);

function bindEvents() {
  document.querySelector("#add").addEventListener("click", addTask);
  document.querySelector("#delete").addEventListener("click", deleteTasks);
  document.querySelector("#update").addEventListener("click", updateTask);
  document.querySelector("#save").addEventListener("click", saveTask);
  document.querySelector("#load").addEventListener("click", loadTask);
  document.querySelector("#sort").addEventListener("click", sortTasks);
  document.querySelector("#clearall").addEventListener("click", clearAll);
  document.querySelector("#pr").addEventListener("change", updatePr);
  document
    .querySelector("#loadfromserver")
    .addEventListener("click", loadFromServer);
}
function loadFromServer() {
  const promise = doAjax();
  promise
    .then((response) => {
      response.json().then((object) => {
        const taskList = object["task"];
        taskOperations.convertObjectIntoTaskObject(taskList);
        // taskOperations.tasks = tasks;
        printTasks();
        countUpdate();
      });
    })
    .catch((err) => console.log("Server Error ", err));
}
function updatePr() {
  document.querySelector("#currentpr").innerText = this.value;
}
function clearAll() {
  for (let field of fields) {
    document.querySelector(`#${field}`).value = "";
  }
  document.querySelector("#name").focus();
}
function sortTasks() {
  taskOperations.sort();
  printTasks();
}
function saveTask() {
  if (window.localStorage) {
    localStorage.tasks = JSON.stringify(taskOperations.getAllTasks());
    alert("Saved...");
  } else {
    alert("Ur Browser is Outdated not support localStorage...");
  }
}
function loadTask() {
  if (window.localStorage) {
    if (localStorage.tasks) {
      let tasks = JSON.parse(localStorage.tasks);
      console.log(tasks, tasks[0] instanceof Object, tasks[0] instanceof Task);
      taskOperations.convertObjectIntoTaskObject(tasks);
      // taskOperations.tasks = tasks;
      printTasks();
      countUpdate();
    } else {
      alert("No data to Load...");
    }
  } else {
    alert("Ur Browser is Outdated not support localStorage...");
  }
}
function updateTask() {
  for (let key in taskObject) {
    if (key == "markForDelete") {
      continue;
    }
    taskObject[key] = document.querySelector(`#${key}`).value;
  }
  printTasks();
}
function deleteTasks() {
  taskOperations.remove();
  printTasks();
  countUpdate();
}
function countUpdate() {
  let mark = taskOperations.countMark();
  let total = taskOperations.getTotal();
  document.querySelector("#unmarktotal").innerText = total - mark;
  document.querySelector("#marktotal").innerText = mark;

  document.querySelector("#total").innerText = total;
}
const fields = ["id", "name", "descr", "date", "url", "pr"];
function addTask() {
  // let id = document.querySelector('#id').value;
  // let name = document.querySelector('#name').value;

  const task = {};
  for (let field of fields) {
    //task.id  = 1001;
    if (field == "id") {
      task[field] = document.querySelector(`#${field}`).innerText;
      continue;
    }
    task[field] = document.querySelector(`#${field}`).value;
  }
  let len = taskOperations.add(task);
  printTask(task);
  countUpdate();

  clearAll();
  printId();
  console.log("Task Object is ", task);
}
let taskObject;
function edit() {
  let id = this.getAttribute("task-id");
  taskObject = taskOperations.searchById(id);
  for (let key in taskObject) {
    if (key == "markForDelete") {
      continue;
    }
    document.querySelector(`#${key}`).value = taskObject[key];
  }
  //console.log("I am edit");
}
function markForDelete() {
  /*
  For Marking in an object
  1. Get the id from the current icon (u set it eariler)
  2. then search the id in an array and get the object and toggle it
  */
  let id = this.getAttribute("task-id");
  console.log("I am delete ", id);
  taskOperations.mark(id);
  /*
  To make it red
  */
  let tr = this.parentNode.parentNode;
  //tr.className = "alert-danger";
  tr.classList.toggle("alert-danger");
  countUpdate();
  // let currentIcon = this;
  // let td = currentIcon.parentNode;
  // let tr  = td.parentNode;
}

function createIcon(className, fn, taskid) {
  let icon = document.createElement("i");
  // <i class="fas fa-edit"></i>
  // <i class="fas fa-trash-alt"></i>
  icon.className = `fas ${className} click`;
  icon.addEventListener("click", fn); // Attach Event
  icon.setAttribute("task-id", taskid);
  return icon;
}

function printTasks() {
  document.querySelector("#tasks").innerHTML = "";
  let tasks = taskOperations.getAllTasks();
  tasks.forEach(printTask);
}

function printTask(task) {
  let tbody = document.querySelector("#tasks");
  let tr = tbody.insertRow();
  let index = 0;
  for (let key in task) {
    if (key == "markForDelete") {
      continue;
    }
    tr.insertCell(index).innerText = task[key];
    index++;
  }
  let editIcon = createIcon("fa-edit me-2", edit, task.id);
  let deleteIcon = createIcon("fa-trash-alt", markForDelete, task.id);
  let td = tr.insertCell(index);
  td.appendChild(editIcon);
  td.appendChild(deleteIcon);
}
