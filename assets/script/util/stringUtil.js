export default {
  _CHARS: '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ',
  string10to62(number) {
    let chars = this._CHARS.split('');
    let radix = chars.length;
    let qutient = +number;
    let arr = [];
    let pointer;
    do {
      pointer = qutient % radix;
      qutient = (qutient - pointer) / radix;
      arr.unshift(chars[pointer]);
    } while (qutient);
    return arr.join('');
  },

  string62to10(number_code) {
    let chars = this._CHARS;
    let radix = chars.length;
    let length = number_code.length;
    let i = 0;
    let origin_number = 0;
    number_code = String(number_code);
    while (i < length) {
      origin_number += Math.pow(radix, i++) * chars.indexOf(number_code.charAt(length - i) || 0);
    }
    return origin_number;
  }
}
