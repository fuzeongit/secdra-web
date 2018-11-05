import Vue from 'vue'

import {Alert, Confirm, Prompt} from '../components/global'

Vue.prototype.$alert = Alert;
Vue.prototype.$confirm = Confirm;
Vue.prototype.$prompt = Prompt;

// import vueSocketIO from 'vue-socket.io'
// import io from 'socket.io-client'
// Vue.use(vueSocketIO,io("http://47.107.131.24:8089"));

import Http from '../assets/js/util/httpUtil'
import Img from '../assets/js/util/imgUrlUtil'

Vue.prototype.$http = Http;

Vue.prototype.$img = Img;

import filters from "../assets/js/filter"
Vue.prototype.$filter = filters;
for (let name in filters) {
  Vue.filter(name, filters[name])
}

import directive from "../assets/js/directive"
Vue.directive(directive.goTop.name, {
  bind: directive.goTop
});

// for (let name in directive) {
//   Vue.directive(name, directive[name])
// }
