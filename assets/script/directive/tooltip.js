import { Tooltip } from "../../../components/global/Tooltip"
const tooltipMap = new Map()
function inserted(el, { value, arg }) {
  if (el) {
    const tooltip = tooltipMap.get(el) || Tooltip(el, value, { maxWidth: arg })
    tooltipMap.set(el, tooltip)
  }
}

export default {
  bind(el, binding, vnode) {
    inserted(el, binding, vnode)
  },
  update(el, { value }) {
    const tooltip = tooltipMap.get(el)
    tooltip.label = value
  },
  unbind(el) {
    const tooltip = tooltipMap.get(el)
    tooltip.$destroy()
    tooltipMap.delete(el)
  }
}
