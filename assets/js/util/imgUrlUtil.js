import config from "../config"

export default {
  get(url, type) {
    return `${config.qiniu}/${url}${config.qiniuSeparator}${type}`
  }
}
