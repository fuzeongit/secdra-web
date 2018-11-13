import Vue from 'vue';
import MessageComponent from './Main';

const MessageConstructor = Vue.extend(MessageComponent);

/**
 * 信息
 * @param {{message:String},{waitTime?:Number},{callback?:Function}} messageOption
 * @constructor
 */
export const Message = function (messageOption = {}) {
  let instance = new MessageConstructor({
    data: messageOption
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
