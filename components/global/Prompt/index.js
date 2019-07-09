import Vue from 'vue';
import PromptComponent from './Main';

const PromptConstructor = Vue.extend(PromptComponent);

/**
 * 输入
 * @param {{title?:String},{message:String},{persistent?:Boolean},{okDesc?:String},{noDesc?:String},{okCallback?:Function},{noCallback?:Function}} option
 * @constructor
 */
export const Prompt = function (option = {}) {
  const propsData = {
    persistent: option.persistent
  };
  delete option.persistent;
  let instance = new PromptConstructor({
    data: option,
    propsData
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
};
