import { Tooltip } from "../../../components/global/Tooltip"
const tooltipMap = new Map()
function inserted(el, { value, arg }) {
  if (el) {
    const tooltip = tooltipMap.get(el) || Tooltip(el, value, { maxWidth: arg })
    tooltipMap.set(el, tooltip)
  }
}

export default {
  bind(el, binding) {
    inserted(el, binding)
  },
  update(el, { value }) {
    const tooltip = tooltipMap.get(el)
    tooltip.updatePopper()
    tooltip.label = value
  },
  unbind(el) {
    const tooltip = tooltipMap.get(el)
    tooltip.$destroy()
    tooltipMap.delete(el)
  }
}
