import Vue from 'vue';
import LoadingComponent from './Main';

const LoadingConstructor = Vue.extend(LoadingComponent);

/**
 * 等待
* @constructor
*/
export const Loading = function () {
  let instance = new LoadingConstructor({
    data: {
      fixed: true
    }
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  return instance;
};
