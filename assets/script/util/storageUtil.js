import Vue from "vue"

const isServer = Vue.prototype.$isServer
export default {
  localSet(key, value) {
    if (!isServer) {
      localStorage.setItem(key, JSON.stringify(value))
    }
    return value
  },
  localGet(key, defaultValue = null) {
    if (!isServer) {
      const stringValue = localStorage.getItem(key)
      return stringValue ? JSON.parse(stringValue) : defaultValue
    }
    return defaultValue
  },
  sessionSet(key, value) {
    if (!isServer) {
      sessionStorage.setItem(key, JSON.stringify(value))
    }
    return value
  },
  sessionGet(key, defaultValue = null) {
    if (!isServer) {
      const stringValue = sessionStorage.getItem(key)
      return stringValue ? JSON.parse(stringValue) : defaultValue
    }
    return defaultValue
  }
}
