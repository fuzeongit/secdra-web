export default {
  enumProxy(object) {
    return new Proxy(object, {
      get: function (target, key, receiver) {
        return {
          key,
          value: target[key]
        };
      }
    })
  }
}
