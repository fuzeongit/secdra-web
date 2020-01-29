export default {
  /**
   * 合并数组
   * @param array
   * @returns {*[]}
   */
  merge(...array) {
    return array
  },
  /**
   * 获取最大值
   * @param array
   * @returns {number}
   */
  max(array) {
    if (!Array.isArray(array)) {
      throw new TypeError("params is not array")
    }
    return Math.max(...array)
  },
  /**
   * 获取最大值下标
   * @param array
   * @returns {*}
   */
  maxIndex(array) {
    return array.indexOf(this.max())
  },
  /**
   * 获取最小值下标
   * @param array
   * @returns {*}
   */
  minIndex(array) {
    return array.indexOf(this.min())
  },

  /**
   * 获取最小值
   * @param array
   * @returns {number}
   */
  min(array) {
    if (!Array.isArray(array)) {
      throw new TypeError("params is not array")
    }
    return Math.min(...array)
  },
  /**
   * 克隆数组
   * @param array
   * @returns {*[]}
   */
  clone(array) {
    if (!Array.isArray(array)) {
      throw new TypeError("params is not array")
    }
    return [].concat(array)
  },
  /**
   * 清除空对象和空字符
   * @param array
   * @returns {*}
   */
  filterNullOrEmpty(array) {
    if (!Array.isArray(array)) {
      throw new TypeError("params is not array")
    }
    return array.filter(
      (item) => item !== null && item !== "" && item !== undefined
    )
  }
}
