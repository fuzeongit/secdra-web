import {on, off} from "../../../assets/script/util/domUtil"

export default {
  data() {
    return {
      scrollHeight: 0,
      clientHeight: 0,
      _scrollHeightFrameTick: false,
      _mutationObserver: null
    }
  },
  mounted() {
    this._mutationObserver = new MutationObserver((mutations, _observer) => {
      if (!this._scrollHeightFrameTick) {
        requestAnimationFrame(() => {
          this. scrollHeight = document.documentElement.scrollHeight;
          this. clientHeight = document.documentElement.clientHeight;
          // console.log(clientHeight/scrollHeight * clientHeight);
          this._scrollHeightFrameTick = false;
        });
        this._scrollHeightFrameTick = true;
      }
    });
    this._mutationObserver.observe(document.documentElement, {childList: true, subtree: true});
  },
  beforeDestroy() {
    this._mutationObserver.disconnect()
  },
  methods: {
    documentScroll(event) {
      if (!this._requestAnimationFrameTick) {
        requestAnimationFrame(() => {
          let element = event.target instanceof HTMLElement ? event.target : event.target.documentElement;
          this.scrollTop = element.scrollTop;
          this.scrollBottom = element.scrollHeight - this.scrollTop - element.clientHeight;
          this._requestAnimationFrameTick = false;
        });
        this._requestAnimationFrameTick = true;
      }
    },
  }
}
