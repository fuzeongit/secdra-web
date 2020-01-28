export default {
  SECDRA_TYPE: [null, undefined, "specifiedWidth"],
  HEAD_TYPE: [null, undefined, "small50", "small100", "small200"],
  BACK_TYPE: [null, undefined, "backCard"],
  secdra(url, type) {
    if (!this.SECDRA_TYPE.includes(type))
      throw new Error(`图片样式${type}不符合规则`)
    if (url) {
      if (url.indexOf("blob") === 0 || url.indexOf("http") === 0) return url
      if (type) {
        return `${process.env.qiniuImg}/${url}${process.env.qiniuSeparator}${type}`
      } else {
        return `${process.env.qiniuImg}/${url}`
      }
    } else {
      return require("../../image/svg/default-picture.svg")
    }
  },
  head(url, type) {
    if (!this.HEAD_TYPE.includes(type))
      throw new Error(`头像样式${type}不符合规则`)
    if (url) {
      if (url.indexOf("blob") === 0 || url.indexOf("http") === 0) return url
      if (type) {
        return `${process.env.qiniuHead}/${url}${process.env.qiniuSeparator}${type}`
      } else {
        return `${process.env.qiniuHead}/${url}`
      }
    } else {
      return require("../../../assets/image/svg/default-head.svg")
    }
  },
  back(url, type, is) {
    if (!this.BACK_TYPE.includes(type))
      throw new Error(`背景样式${type}不符合规则`)
    if (url) {
      if (url.indexOf("blob") === 0 || url.indexOf("http") === 0) return url
      if (type) {
        if (is) {
          return `${process.env.qiniuBack}/${url}?${type}`
        } else {
          return `${process.env.qiniuBack}/${url}${process.env.qiniuSeparator}${type}`
        }
      } else {
        return `${process.env.qiniuBack}/${url}`
      }
    } else {
      return require("../../image/svg/default-picture.svg")
    }
  }
}
