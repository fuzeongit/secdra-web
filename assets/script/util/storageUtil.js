import Vue from "vue"

const isServer = Vue.prototype.$isServer
export default {
  localSet(key, value) {
    if (!isServer) {
      localStorage.setItem(key, JSON.stringify(value))
    }
    return value
  },
  localGet(key, defaultValue) {
    if (!isServer) {
      const stringValue = localStorage.getItem(key)
      return stringValue ? JSON.parse(stringValue) : defaultValue
    }
    return defaultValue
  }
}
