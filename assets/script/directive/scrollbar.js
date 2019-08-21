import Vue from "vue"
import ScrollBar from "../../../components/global/ScrollBar"

const ScrollBarConstructor = Vue.extend(ScrollBar)

function scroller(el, binding, vnode) {
  const _ref = binding.expression ? binding.value : binding.arg
  const scrollBox = vnode.context.$refs[_ref]
  const instance = new ScrollBarConstructor({
    data: {
      scrollElement: scrollBox
    }
  })
  instance.vm = instance.$mount()
  const elPosition = window.getComputedStyle(el).position
  if (
    elPosition !== "fixed" &&
    elPosition !== "absolute" &&
    elPosition !== "relative"
  ) {
    el.classList.add("scroll-box")
  }
  el.appendChild(instance.vm.$el)
}

export default {
  bind(el, binding, vnode) {
    scroller(el, binding, vnode)
  },
  inserted(el, binding, vnode) {
    scroller(el, binding, vnode)
  }
}
