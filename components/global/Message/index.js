import Vue from 'vue';
import MessageComponent from './Main';

const MessageConstructor = Vue.extend(MessageComponent);

/**
 * 信息
 * @param {{message:String},{waitTime?:Number},{callback?:Function}} option
 * @constructor
 */
export const Message = function (option = {}) {
  const propsData = {
    persistent: option.persistent
  };
  delete option.persistent;
  let instance = new MessageConstructor({
    propsData,
    data: option
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
