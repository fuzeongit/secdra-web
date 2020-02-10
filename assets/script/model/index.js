import { enumObjectList } from "../constant"

/**
 * @author
 * @description 这里有个坑，就是在asyncDate传递数据的时候会报一个警告，所以不再使用class这种方式直接使用create方法返回
 */

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
    this.page = !page ? 0 : page - 1
    this.size = size
    this.sort = sort
  }
}

export class PictureForm {
  constructor() {
    this.name = ""
    this.introduction = ""
    this.privacy = enumObjectList.PrivacyState.PUBLIC.key
    this.tagList = []
  }
}

export class CommentForm {
  constructor(authorId = "", pictureId = "") {
    this.authorId = authorId
    this.pictureId = pictureId
    this.content = ""
  }
}

export class ReplyForm {
  constructor(commentId = "", pictureId = "", authorId = "", criticId = "") {
    this.commentId = commentId
    this.pictureId = pictureId
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

export class FilterForm {
  constructor(precise, name, startDate, endDate) {
    this.precise = precise
    this.name = name
    this.startDate = startDate
    this.endDate = endDate
  }
}

export function createResult(status, data, message) {
  return {
    status,
    data,
    message
  }
}
export function createPageable(page = 0, size = 20, sort = "") {
  return {
    page: !page ? 0 : page - 1,
    size,
    sort
  }
}
export function createPictureForm() {
  return {
    name: "",
    introduction: "",
    privacy: enumObjectList.PrivacyState.PUBLIC.key,
    tagList: []
  }
}
export function createCommentForm(authorId = "", pictureId = "") {
  return {
    authorId,
    pictureId,
    content: ""
  }
}
export function createReplyForm(
  commentId = "",
  pictureId = "",
  authorId = "",
  criticId = ""
) {
  return {
    commentId,
    pictureId,
    authorId,
    criticId,
    content: ""
  }
}
export function createStompSubscribe(eventName, callback) {
  return new StompSubscribe(eventName, callback)
}
export function createFilterForm(precise, name, startDate, endDate) {
  return {
    precise,
    name,
    startDate,
    endDate
  }
}
