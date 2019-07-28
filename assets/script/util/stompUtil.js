import SockJS from 'sockjs-client';
import Stomp from "stompjs"
import Vue from 'vue';
import Cookies from "js-cookie";

const isServer = Vue.prototype.$isServer;
let socket = null;
let client = null;

export default {
  connect() {
    return new Promise((resolve, reject) => {
        if (isServer) {
          reject("service")
        } else {
          //是否初始化了
          if (!client) {
            if(socket){
              socket.close();
              socket = null;
            }
            socket = new SockJS(process.env.baseUrl + "/webSocket");
            client = Stomp.over(socket);
            client.debug = false
          }
          //是否连接中
          if (!client.connected) {
            client.connect({token: Cookies.get('token') || ""}, () => {
              resolve(client)
            })
          }
          else {
            resolve(client)
          }
        }
      }
    )
  },
  unsubscribeAll() {
    for (let sub in client.subscriptions) {
      if (client.subscriptions.hasOwnProperty(sub)) {
        client.unsubscribe(sub);
      }
    }
  },
  send(eventName, params, header = {}) {
    client.send(eventName, header,JSON.stringify(params))
  }
}
