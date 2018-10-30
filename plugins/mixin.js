import Vue from 'vue'

import {Alert,Confirm} from '../components/global'
Vue.prototype.$alert = Alert;
Vue.prototype.$confirm = Confirm;

import vueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'
Vue.use(vueSocketIO,io("http://localhost:8089"));

import Http from '../assets/js/util/httpUtil'
Vue.prototype.$http = Http;

import filters from "../assets/js/filter"
Vue.prototype.$filter = filters;
for(let name in filters){
  Vue.filter(name,filters[name])
}
