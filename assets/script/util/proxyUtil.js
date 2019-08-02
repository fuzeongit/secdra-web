export default {
  enumProxy(object) {
    let o = {};
    for (let key of Object.keys(object)) {
      o[key] = {key: key, value: object[key]}
    }
    return o
  }
}
