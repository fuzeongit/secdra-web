export function debounce(fn, wait, immediate) {
  let timer
  return function() {
    const context = this
    const args = arguments
    if (timer) clearTimeout(timer)
    if (immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (callNow) fn.apply(context, args)
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  }
}

export function throttle(fn, wait) {
  // let previous = 0
  // return function() {
  //   const now = Date.now()
  //   if (now - previous > wait) {
  //     fn.apply(this, arguments)
  //     previous = now
  //   }
  // }
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        fn.apply(context, args)
      }, wait)
    }
  }
}
