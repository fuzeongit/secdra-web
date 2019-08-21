export default {
  _CHARS: "0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ",
  string10to62(number) {
    const chars = this._CHARS.split("")
    const radix = chars.length
    let qutient = +number
    const arr = []
    let pointer
    do {
      pointer = qutient % radix
      qutient = (qutient - pointer) / radix
      arr.unshift(chars[pointer])
    } while (qutient)
    return arr.join("")
  },

  string62to10(numberCode) {
    const chars = this._CHARS
    const radix = chars.length
    const length = numberCode.length
    let i = 0
    let originNumber = 0
    numberCode = String(numberCode)
    while (i < length) {
      originNumber +=
        radix ** i++ * chars.indexOf(numberCode.charAt(length - i) || 0)
    }
    return originNumber
  }
}
