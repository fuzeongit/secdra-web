import { enumObjectList } from "../constant"

export class Result {
  /**
   * 统一返回
   * @param {Number} status
   * @param {Object} data
   * @param {String}message
   */
  constructor(status, data, message) {
    this.status = status
    this.data = data
    this.message = message
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
    this.page = page
    this.size = size
    this.sort = sort
  }
}

export class DrawForm {
  constructor() {
    this.name = ""
    this.introduction = ""
    this.privacy = enumObjectList.PrivacyState.PUBLIC.key
    this.tagList = []
  }
}

export class CommentForm {
  constructor(authorId = "", drawId = "") {
    this.authorId = authorId
    this.drawId = drawId
    this.content = ""
  }
}

export class ReplyForm {
  constructor(commentId = "", drawId = "", authorId = "", criticId = "") {
    this.commentId = commentId
    this.drawId = drawId
    this.authorId = authorId
    this.criticId = criticId
    this.content = ""
  }
}

export class StompSubscribe {
  /**
   * @param {String}eventName
   * @param {Function}callback
   */
  constructor(eventName, callback) {
    this._eventName = eventName
    this._callback = callback
  }

  get eventName() {
    return this._eventName
  }

  set eventName(value) {
    this._eventName = value
  }

  get callback() {
    return (response) => {
      this._callback(JSON.parse(response.body))
    }
  }

  set callback(value) {
    this._callback = value
  }
}

export class FliterForm {
  constructor(precise, name, startDate, endDate) {
    this.precise = precise
    this.name = name
    this.startDate = startDate
    this.endDate = endDate
  }
}

export class EnumObject {
  constructor(eventName, callback) {
    this._eventName = eventName
    this._callback = callback
  }
}
