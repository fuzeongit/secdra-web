import Vue from 'vue';
import AlertComponent from './Main';

const AlertConstructor = Vue.extend(AlertComponent);

/**
 * 弹窗
 * @param {{title?:String},{message:String},{persistent?:Boolean},{btnDesc?:String},{callback?:String}} option
 * @constructor
 */
export const Alert = function (option = {}) {
  const propsData = {
    persistent: option.persistent
  };
  delete option.persistent;
  let instance = new AlertConstructor({
    data: option,
    propsData
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
