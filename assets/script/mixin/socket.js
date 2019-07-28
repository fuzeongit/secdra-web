import {mapState} from "vuex"
import stompUtil from "../util/stompUtil";

export default {
  data() {
    return {
      _subList: []
    };
  },
  watch: {
    status(newVal, oldVal) {
      if (newVal && !oldVal) {
        let socketEventList = this.socketEvent();
        let subList = [];
        for (let socketEvent of socketEventList) {
          subList.push(stompUtil.client.subscribe(socketEvent.eventName, socketEvent.callback));
        }
        this._subList = subList;
      }
    }
  },
  computed: {
    ...mapState('socket', ['status'])
  },
  mounted() {
    if (this.status) {
      let socketEventList = this.socketEvent();
      let subList = [];
      for (let socketEvent of socketEventList) {
        subList.push(stompUtil.client.subscribe(socketEvent.eventName, socketEvent.callback));
      }
      this._subList = subList;
    }
  },
  beforeDestroy() {
    let sub;
    if (this._subList) {
      while (sub = this._subList.shift()) {
        sub.unsubscribe();
      }
    }
  },
  methods: {
    socketEvent() {
      return []
    }
  }
}
