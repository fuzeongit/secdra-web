export class Result {
  constructor(status, data, message) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

export class Pageable {
  /**
   * 分页
   * @param {Number}page
   * @param {Number}size
   * @param {String}sort
   */
  constructor(page = 0, size = 20, sort = "") {
    this.page = page;
    this.size = size;
    this.sort = sort;
  }
}

export class DrawForm {
  constructor() {
    this.name = "";
    this.introduction = "";
    this.isPrivate = null;
    this.tagList = [];
  }
}
