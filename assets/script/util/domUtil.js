import Vue from "vue"

const isServer = Vue.prototype.$isServer
/* istanbul ignore next */
export const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.includes(" ")) throw new Error("className should not contain space.")
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (" " + el.className + " ").includes(" " + cls + " ")
  }
}

export function addClass(el, cls) {
  if (!el) return
  let curClass = el.className
  const classes = (cls || "").split(" ")

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) return
  const classes = cls.split(" ")
  let curClass = " " + el.className + " "

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ")
    }
  }
  if (!el.classList) {
    el.className = curClass.trim()
  }
}

export function scrollToBySmooth(dom, targetTop, number = 10) {
  dom =
    dom instanceof Window
      ? dom.document.documentElement
      : dom instanceof Document
      ? dom.documentElement
      : dom

  function intervalFun(dom, distance, number) {
    dom.scrollTo(0, dom.scrollTop + distance)
    requestAnimationFrame(() => {
      if (number) {
        intervalFun(dom, distance, number - 1)
      }
    })
  }

  intervalFun(dom, (targetTop - dom.scrollTop) / number, number)
}
