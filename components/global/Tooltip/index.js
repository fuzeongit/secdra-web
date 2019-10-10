import Vue from "vue"
import TooltipComponent from "./Main"

const TooltipConstructor = Vue.extend(TooltipComponent)

export const Tooltip = function(el, label, option = {}) {
  const propsData = {
    reference: el,
    trigger: "hover",
    offset: "0,5px"
  }
  option.maxWidth && (propsData.maxWidth = option.maxWidth)
  const instance = new TooltipConstructor({
    data: { label },
    propsData
  })
  instance.vm = instance.$mount()
  return instance.vm
}
