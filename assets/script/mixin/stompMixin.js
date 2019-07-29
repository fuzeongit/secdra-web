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
        this._subscribe()
      }
    }
  },
  computed: {
    ...mapState('stomp', ['status'])
  },
  mounted() {
    if (this.status) {
      this._subscribe()
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
    _subscribe() {
      let stompSubscribeList = this.stompSubscribeList();
      let subList = [];
      for (let stompSubscribe of stompSubscribeList) {
        subList.push(stompUtil.client.subscribe(stompSubscribe.eventName, stompSubscribe.callback));
      }
      this._subList = subList;
    },
    stompSubscribeList() {
      return []
    }
  }
}
