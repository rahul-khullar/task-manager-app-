// CRUD Logic
const taskOperations = {
  tasks: [],
  isAsc: true,
  getTotal() {
    return this.tasks.length;
  },
  getAllTasks() {
    return this.tasks;
  },
  convertObjectIntoTaskObject(tasks) {
    this.tasks = tasks.map(
      (task) =>
        new Task(task.id, task.name, task.descr, task.date, task.url, task.pr)
    );
    return this.tasks;
  },
  add(task) {
    let taskObject = new Task(
      task.id,
      task.name,
      task.descr,
      task.date,
      task.url,
      task.pr
    );
    this.tasks.push(taskObject);
    return this.tasks.length;
  },
  remove() {
    this.tasks = this.tasks.filter((task) => !task.markForDelete);
    return this.tasks;
  },
  countMark() {
    return this.tasks.filter((task) => task.markForDelete).length;
  },
  mark(id) {
    let taskObject = this.searchById(id);
    if (taskObject) {
      taskObject.toggle();
    }
  },

  searchById(id) {
    return this.tasks.find((task) => task.id == id);
  },
  update() {},
  sort() {
    if (this.isAsc) {
      this.isAsc = !this.isAsc;
      return this.tasks.sort((first, second) =>
        first.name.localeCompare(second.name)
      );
    } else {
      this.isAsc = !this.isAsc;
      return this.tasks.sort((first, second) =>
        second.name.localeCompare(first.name)
      );
    }
  },
};
