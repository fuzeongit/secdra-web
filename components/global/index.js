import Vue from 'vue';
import AlertComponent from './Alert';

const AlertConstructor = Vue.extend(AlertComponent);

/**
 * 弹窗
 * @param {{message:String},{btnDesc?:String}} alertOption
 * @constructor
 */
const Alert = function (alertOption = {}) {
  let instance = new AlertConstructor({
    data: alertOption
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
export default Alert;
