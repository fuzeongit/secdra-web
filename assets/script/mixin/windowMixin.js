import {on, off} from "../../../assets/script/util/domUtil"

export default {
  data() {
    return {
      scrollTop: 0,
      scrollBottom: 0,
      _scrollAnimationFrameTick: false
    }
  },
  mounted() {
    on(document, 'scroll', this.documentScroll)
  },
  beforeDestroy() {
    off(document, 'scroll', this.documentScroll);
  },
  methods: {
    documentScroll(event) {
      if (!this._scrollAnimationFrameTick) {
        requestAnimationFrame(() => {
          let element = event.target instanceof HTMLElement ? event.target : event.target.documentElement;
          this.scrollTop = element.scrollTop;
          this.scrollBottom = element.scrollHeight - this.scrollTop - element.clientHeight;
          this._scrollAnimationFrameTick = false;
        });
        this._scrollAnimationFrameTick = true;
      }
    },
  }
}
