export class Result {
  /**
   * 统一返回
   * @param {Number} status
   * @param {Object} data
   * @param {String}message
   */
  constructor(status, data, message) {
    this._status = status;
    this._data = data;
    this._message = message;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this._status = value;
  }

  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;
  }

  get message() {
    return this._message;
  }

  set message(value) {
    this._message = value;
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
    this._page = page;
    this._size = size;
    this._sort = sort;
  }

  get page() {
    return this._page;
  }

  set page(value) {
    this._page = value;
  }

  get size() {
    return this._size;
  }

  set size(value) {
    this._size = value;
  }

  get sort() {
    return this._sort;
  }

  set sort(value) {
    this._sort = value;
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

export class CommentForm {
  constructor(authorId = "", drawId = "") {
    this.authorId = authorId;
    this.drawId = drawId;
    this.content = "";
  }
}

export class ReplyForm {
  constructor(commentId = "", drawId = "", authorId = "", criticId = "") {
    this.commentId = commentId;
    this.drawId = drawId;
    this.authorId = authorId;
    this.criticId = criticId;
    this.content = "";
  }
}

export class SocketEvent {
  /**
   * @param {String}eventName
   * @param {Function}callback
   */
  constructor(eventName, callback) {
    this._eventName = eventName;
    this._callback = callback;
  }

  get eventName() {
    return this._eventName;
  }

  set eventName(value) {
    this._eventName = value;
  }

  get callback() {
    return (response) => {
      this._callback(JSON.parse(response.body));
    }
  }

  set callback(value) {
    this._callback = value;
  }
}
