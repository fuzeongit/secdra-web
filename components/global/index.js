import Vue from 'vue';
import AlertComponent from './Alert';
import ConfirmComponent from './Confirm';
import PromptComponent from './Prompt';

const AlertConstructor = Vue.extend(AlertComponent);
const ConfirmConstructor = Vue.extend(ConfirmComponent);
const PromptConstructor = Vue.extend(PromptComponent);

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

/**
 * 输入
 * @param {{title?:String},{message:String},{okDesc?:String},{noDesc?:String},{okCallback?:Function},{noCallback?:Function}} promptOption
 * @constructor
 */
export const Prompt = function (promptOption = {}) {
  let instance = new PromptConstructor({
    data: promptOption
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
