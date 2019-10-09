import { Tooltip } from "../../../components/global/Tooltip"
function popover(el) {
  const tooltip = Tooltip(el, "大西瓜")
  el.addEventListener("mouseenter", () => {
    tooltip.showPopper = true
  })
}

export default {
  bind(el, binding, vnode) {
    popover(el, binding, vnode)
  },
  inserted(el, binding, vnode) {
    popover(el, binding, vnode)
  }
}
