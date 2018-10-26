export default {
  get(key, cookieStr) {
    let _document = null;
    try {
      _document = document
    }catch (e) {
      // console.log("document is not defined")
    }
    let cookies = "";

    if (cookieStr) {
      cookies = cookieStr
    } else if (_document) {
      cookies = _document.cookie;
    } else {
      return [];
    }

    let strList = cookies.split("; ") || [];
    let list = [];
    for (let strListElement of strList) {
      let cookie = strListElement.split("=") || [];
      if (cookie.length) {
        list[`${cookie[0]}`] = cookie[1]
      }
    }
    if (key) {
      let value = list[key];
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    }
    return list
  }
}
