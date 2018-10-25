import Vue from 'vue'
import vueSocketIO from 'vue-socket.io'
import io from 'socket.io-client'
Vue.use(vueSocketIO,io("http://localhost:8089"));
