import Vue from 'vue';
import ConfirmComponent from './Main';

const ConfirmConstructor = Vue.extend(ConfirmComponent);

/**
 * 询问
 * @param {{title?:String},{message:String},{persistent?:Boolean},{okDesc?:String},{noDesc?:String},{okCallback?:Function},{noCallback?:Function}} option
 * @constructor
 */
export const Confirm = function (option = {}) {
  const propsData = {
    persistent: option.persistent
  };
  delete option.persistent;
  let instance = new ConfirmConstructor({
    data: option,
    propsData
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
