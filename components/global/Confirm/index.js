import Vue from 'vue';
import ConfirmComponent from './Main';

const ConfirmConstructor = Vue.extend(ConfirmComponent);

/**
 * 询问
 * @param {{title?:String},{message:String},{okDesc?:String},{noDesc?:String},{okCallback?:Function},{noCallback?:Function}} confirmOption
 * @constructor
 */
export const Confirm = function (confirmOption = {}) {
  let instance = new ConfirmConstructor({
    data: confirmOption
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
