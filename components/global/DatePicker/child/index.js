import Vue from "vue"
import YearComponent from "./Year"
import MonthComponent from "./Month"
import CalendarComponent from "./Calendar"

const YearConstructor = Vue.extend(YearComponent)
const MonthConstructor = Vue.extend(MonthComponent)
const CalendarConstructor = Vue.extend(CalendarComponent)

export default {
  mountYear(dom, calendar, date, type, clickFunction) {
    const data = {}
    if (type === "prev") {
      data.enterActiveClass = "fadeInLeft"
    } else if (type === "next") {
      data.enterActiveClass = "fadeInRight"
    }
    data.date = date
    const instance = new YearConstructor({
      propsData: {
        calendar,
        clickFunction
      },
      data
    })
    instance.vm = instance.$mount()
    dom.appendChild(instance.vm.$el)
    instance.visible = true
    return instance
  },
  mountMonth(dom, calendar, date, type, clickFunction) {
    const data = {}
    if (type === "prev") {
      data.enterActiveClass = "fadeInLeft"
    } else if (type === "next") {
      data.enterActiveClass = "fadeInRight"
    }
    data.date = date
    const instance = new MonthConstructor({
      propsData: {
        calendar,
        clickFunction
      },
      data
    })
    instance.vm = instance.$mount()
    dom.appendChild(instance.vm.$el)
    instance.visible = true
    return instance
  },
  mountCalendar(dom, calendar, date, type, clickFunction) {
    const data = {}
    if (type === "prev") {
      data.enterActiveClass = "fadeInLeft"
    } else if (type === "next") {
      data.enterActiveClass = "fadeInRight"
    }
    data.date = date
    const instance = new CalendarConstructor({
      propsData: {
        calendar,
        clickFunction
      },
      data
    })
    instance.vm = instance.$mount()
    dom.appendChild(instance.vm.$el)
    instance.visible = true
    return instance
  }
}
