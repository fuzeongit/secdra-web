import Vue from "vue"
import TooltipComponent from "./Main"

const TooltipConstructor = Vue.extend(TooltipComponent)

export const Tooltip = function(el, label) {
  const propsData = {
    reference: el
  }
  const instance = new TooltipConstructor({
    data: { label },
    propsData
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.showPopper = true
  return instance.vm
}
