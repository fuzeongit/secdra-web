import {mapActions, mapState} from "vuex"
import stompUtil from "../util/stompUtil";
import socketBus from "../bus/socketBus";

export default {
  data() {
    return {
      _subList: []
    };
  },
  computed: {
    ...mapState('socket', ['status'])
  },
  mounted() {
    socketBus.$once("connect",()=>{
      let socketEventList = this.socketEvent();
      let subList = [];
      for (let socketEvent of socketEventList) {
        subList.push(stompUtil.client.subscribe(socketEvent.eventName, socketEvent.callback));
      }
      this._subList = subList;
    });
    this.status && this.socketConnect();
  },
  beforeDestroy() {
    let sub;
    while (sub = this._subList.shift()) {
      sub.unsubscribe();
    }
  },
  methods: {
    socketConnect() {
      socketBus.$emit("connect")
    },
    socketEvent() {
      return []
    }
  }
}
