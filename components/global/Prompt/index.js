import Vue from 'vue';
import PromptComponent from './Main';

const PromptConstructor = Vue.extend(PromptComponent);

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
