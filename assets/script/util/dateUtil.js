import moment from "moment/moment"

export default {
  addDay(date = new Date(), delta = 0) {
    date = new Date(date)
    if (delta) {
      date.setDate(date.getDate() + delta)
      return date
    }
    return date
  },

  addMonth(date = new Date(), delta = 0) {
    date = new Date(date)
    if (delta) {
      date.setMonth(date.getMonth() + delta)
      return date
    }
    return date
  },

  addYear(date = new Date(), delta = 0) {
    date = new Date(date)
    if (delta) {
      date.setFullYear(date.getFullYear() + delta)
      return date
    }
    return date
  },

  format(date = new Date(), formatString) {
    if (formatString) {
      return moment(date).format(formatString)
    }
    return date
  },

  differTo(date = new Date(), defaultDate = new Date()) {
    date = new Date(date)
    defaultDate = new Date(defaultDate)
    return {
      yyyy: defaultDate.getFullYear() - date.getFullYear(),
      MM: defaultDate.getMonth() - date.getMonth(),
      dd: defaultDate.getDate() - date.getDate(),
      HH: defaultDate.getHours() - date.getHours(),
      mm: defaultDate.getMinutes() - date.getMinutes(),
      ss: defaultDate.getSeconds() - date.getSeconds()
    }
  },

  ago(date = new Date()) {
    const differ = this.differTo(date)
    const keys = Object.keys(differ)
    // eslint-disable-next-line no-unused-vars
    for (const key of keys) {
      if (key === "yyyy" && differ[key] > 0) {
        return differ[key] + "年前"
      } else if (key === "MM" && differ[key] > 0) {
        return differ[key] + "月前"
      } else if (key === "dd" && differ[key] > 0) {
        return differ[key] + "天前"
      } else if (key === "HH" && differ[key] > 0) {
        return differ[key] + "小时前"
      } else if (key === "mm" && differ[key] > 0) {
        return differ[key] + "分钟前"
      } else if (key === "ss" && differ[key] > 0) {
        return differ[key] + "秒前"
      }
    }
  }
}
