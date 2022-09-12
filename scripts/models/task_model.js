class Task {
  constructor(id, name, descr, date, url, pr) {
    this.id = id;
    this.name = name;
    this.descr = descr;
    this.date = date;
    this.url = url;
    this.pr = pr;
    this.markForDelete = false;
  }
  toggle() {
    this.markForDelete = !this.markForDelete;
  }
}
