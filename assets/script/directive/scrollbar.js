import Vue from 'vue';
import ScrollBar from '../../../components/global/ScrollBar';

const ScrollBarConstructor = Vue.extend(ScrollBar);

export default {
  inserted(el, binding, vnode) {
    let instance = new ScrollBarConstructor({
      data: {
        scrollElement: el
      }
    });
    instance.vm = instance.$mount();
    let elPosition = window.getComputedStyle(el).position;
    if (elPosition !== "fixed" && elPosition !== "absolute" && elPosition !== "relative") {
      el.classList.add("scroll-box");
    }
    el.appendChild(instance.vm.$el);
  }
}
