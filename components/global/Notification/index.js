import Vue from "vue"
import NotificationComponent from "./Main"

const NotificationConstructor = Vue.extend(NotificationComponent)

let instance
const instances = []
let seed = 1

/**
 * 通知
 * @param notificationOptions
 * @returns {NotificationConstructor|CombinedVueInstance<CombinedVueInstance<Vue, any, any, any, Record<never, any>> & Vue, object, object, object, Record<never, any>>}
 * @constructor
 */
export const Notification = function(notificationOptions = {}) {
  const id = "notification_" + seed++
  const callback = notificationOptions.callback
  // const position = notificationOptions.position || "top-right"

  const propsData = {
    persistent: notificationOptions.persistent
  }
  delete notificationOptions.persistent

  instance = new NotificationConstructor({
    propsData,
    data: notificationOptions
  })

  notificationOptions.callback = function() {
    close(id, callback)
  }
  let verticalOffset = notificationOptions.offset || 0
  instances.forEach((item) => {
    verticalOffset += item.$el.offsetHeight + 15
  })
  verticalOffset += 15
  instance.verticalOffset = verticalOffset
  instance.id = id
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.dom = instance.$el
  instance.visible = true
  instances.push(instance)
  return instance
}

function close(id, userOnClose) {
  const index = instances.findIndex((item) => item.id === id)
  const len = instances.length
  const instance = instances[index]
  // const instance = instances.filter((instance, i) => {
  //   if (instance.id === id) {
  //     index = i;
  //     return true;
  //   }
  //   return false;
  // })[0];

  if (!instance) return

  if (typeof userOnClose === "function") {
    userOnClose(instance)
  }
  instances.splice(index, 1)

  if (len <= 1) return
  // const position = instance.position
  const removedHeight = instance.dom.offsetHeight
  for (let i = index; i < len - 1; i++) {
    instances[i].dom.style.top =
      parseInt(instances[i].dom.style.top, 10) - removedHeight - 15 + "px"
    // if (instances[i].position === position) {
    //   instances[i].dom.style[instance.verticalProperty] =
    //     parseInt(instances[i].dom.style[instance.verticalProperty], 10) - removedHeight - 16 + 'px';
    // }
  }
}
