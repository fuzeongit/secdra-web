import Vue from 'vue';
import NotificationComponent from './Main';

const NotificationConstructor = Vue.extend(NotificationComponent);

let instance;
let instances = [];
let seed = 1;


const Notification = function(notificationOptions = {}) {
  const id = 'notification_' + seed++;
  const position = notificationOptions.position || 'top-right';

  instance = new NotificationConstructor({
    data: notificationOptions
  });

  instance.id = id;
  instance.$mount();
  document.body.appendChild(instance.$el);
  instance.visible = true;
  instance.dom = instance.$el;

  let verticalOffset = notificationOptions.offset || 0;
  instances.filter(item => item.position === position).forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  verticalOffset += 16;
  instance.verticalOffset = verticalOffset;
  instances.push(instance);
  return instance;
};
