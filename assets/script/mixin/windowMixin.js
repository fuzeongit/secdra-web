import { on, off } from "../../../assets/script/util/domUtil"
import { throttle } from "../util/heightenUtil"

export default {
  data() {
    return {
      scrollElement: null,
      scrollTop: 0,
      scrollBottom: 0,
      documentScrollThrottle: throttle(this.documentScroll, 16)
    }
  },
  mounted() {
    this.getScroll()
    on(this.scrollElement || document, "scroll", this.documentScrollThrottle)
  },
  beforeDestroy() {
    off(this.scrollElement || document, "scroll", this.documentScrollThrottle)
  },
  methods: {
    documentScroll(event) {
      const element =
        event.target instanceof HTMLElement
          ? event.target
          : event.target.documentElement
      this.getScroll(element)
    },
    getScroll(element = this.scrollElement || document.documentElement) {
      this.scrollTop = element.scrollTop
      this.scrollBottom =
        element.scrollHeight - this.scrollTop - element.clientHeight
    }
  }
}
