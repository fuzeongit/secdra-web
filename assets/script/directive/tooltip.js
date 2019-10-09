import { Tooltip } from "../../../components/global/Tooltip"
import { on } from "../util/domUtil"
const tooltipMap = new Map()
function inserted(el, { value }) {
  on(el, "mouseenter", () => {
    const tooltip = tooltipMap.get(el) || Tooltip(el, value)
    tooltipMap.set(el, tooltip)
    tooltip.showPopper = true
  })
  on(el, "mouseleave", () => {
    const tooltip = tooltipMap.get(el)
    tooltip.showPopper = false
    tooltipMap.delete(el)
  })
}

function update(el, { value }) {
  const tooltip = tooltipMap.get(el)
  tooltip.label = value
  tooltipMap.set(el, tooltip)
}

export default {
  bind(el, binding, vnode) {
    inserted(el, binding, vnode)
  },
  inserted(el, binding, vnode) {
    inserted(el, binding, vnode)
  },
  update(el, binding, vnode) {
    update(el, binding, vnode)
  }
}
