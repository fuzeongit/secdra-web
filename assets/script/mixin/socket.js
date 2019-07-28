import stompUtil from "../util/stompUtil";

export default {
  data() {
    return {
      $stompClient: null,
      _subList: []
    };
  },
  async mounted() {
    let stompClient = await stompUtil.connect();
    let socketEventList = this.socketEvent();
    let subList = [];
    for (let socketEvent of socketEventList) {
      subList.push(stompClient.subscribe(socketEvent.eventName, socketEvent.callback));
    }
    this._subList = subList;
    this.$stompClient = stompUtil;
  },
  beforeDestroy() {
    let sub;
    while (sub = this._subList.shift()) {
      sub.unsubscribe();
    }
  },
  methods: {
    socketEvent() {
      return []
    }
  }
}
