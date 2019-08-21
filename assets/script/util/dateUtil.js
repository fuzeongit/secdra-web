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
  }
}
