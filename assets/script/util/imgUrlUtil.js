export default {
  SECDRA_TYPE: [
    null,
    undefined,
    "specifiedWidth",
    "specifiedHeight",
    "specifiedWidth300",
    "specifiedWidth500",
    "specifiedWidth1200",
    "specifiedHeight1200"
  ],
  SECDRA_SIZE: [null, undefined, 240, 300, 500, 1200],
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
  secdraByObject({ url, height, width }, size, opposite = false) {
    if (!this.SECDRA_SIZE.includes(size))
      throw new Error(`图片尺寸${size}不符合规则`)
    if (url && height && width) {
      if (url.indexOf("blob") === 0 || url.indexOf("http") === 0) return url
      if (size) {
        const proportion = opposite ? width / height : height / width
        const prefix = proportion >= 1 ? "specifiedHeight" : "specifiedWidth"
        if (size === 240) size = ""
        return `${process.env.qiniuImg}/${url}${
          process.env.qiniuSeparator
        }${prefix + size}`
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
  },
  secdraLazy(unknown, type, opposite = false) {
    let src = require("../../image/svg/default-picture.svg")
    if (typeof unknown === "string") {
      src = this.secdra(unknown, type)
    } else if (typeof unknown === "object") {
      src = this.secdraByObject(unknown, type, opposite)
    } else {
      throw new TypeError("传递数据不符合规则")
    }
    return {
      src,
      error: require("../../image/svg/default-picture.svg"),
      loading: require("../../image/svg/default-picture.svg")
    }
  },
  headLazy(url, type) {
    return {
      src: this.head(url, type),
      error: require("../../../assets/image/svg/default-head.svg"),
      loading: require("../../../assets/image/svg/default-head.svg")
    }
  },
  backLazy(url, type, is) {
    return {
      src: this.back(url, type, is),
      error: require("../../image/svg/default-picture.svg"),
      loading: require("../../image/svg/default-picture.svg")
    }
  }
}
