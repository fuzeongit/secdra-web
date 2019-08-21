export default {
  enumProxy(object) {
    const o = {}
    Object.keys(object).forEach((key) => {
      o[key] = { key, value: object[key] }
    })
    return o
  }
}
