/**
 * 合并数组，支持链式调用
 * @param {Array} array
 * @returns {Array  }
 */
Array.prototype.merge = function(array = []) {
  if (array && Array.isArray(array) && array.length) {
    this.push.apply(this, array)
  }
  return this
}

/**
 * 删除数组指定下标
 * @param from
 * @param to
 * @returns {number}
 */
Array.prototype.removeIndex = function(from, to) {
  const rest = this.slice((to || from) + 1 || this.length)
  this.length = from < 0 ? this.length + from : from
  return this.push.apply(this, rest)
}

/**
 * 删除指定元素，支持链式调用
 * @param item
 * @returns {Array}
 */
Array.prototype.remove = function(item) {
  const index = this.indexOf(item)
  if (index >= 0) {
    this.splice(index, 1)
  }
  return this
}

/**
 * 获取最大值
 * @returns {number}
 */
Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

/**
 * 获取最小值
 * @returns {number}
 */
Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

/**
 * 获取最大值下标
 * @returns {number}
 */
Array.prototype.maxIndex = function() {
  const max = Math.max.apply(null, this)
  return this.indexOf(max)
}

/**
 * 获取最小值下标
 * @returns {number}
 */
Array.prototype.minIndex = function() {
  const min = Math.min.apply(null, this)
  return this.indexOf(min)
}

/**
 * 清空数组
 */
Array.prototype.clear = function() {
  if (this.length > 0) {
    this.splice(0, this.length)
  }
  return this
}

/**
 * 判断数组是否为空
 * @returns {boolean}
 */
Array.prototype.isEmpty = function() {
  return this.length === 0
}

/**
 * 克隆数组
 * @returns {*[]}
 */
Array.prototype.clone = function() {
  return [].concat(this)
}
