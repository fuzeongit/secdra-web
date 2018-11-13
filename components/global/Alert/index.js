import Vue from 'vue';
import AlertComponent from './Main';

const AlertConstructor = Vue.extend(AlertComponent);

/**
 * 弹窗
 * @param {{title?:String},{message:String},{btnDesc?:String},{callback?:String}} alertOption
 * @constructor
 */
export const Alert = function (alertOption = {}) {
  let instance = new AlertConstructor({
    data: alertOption
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
