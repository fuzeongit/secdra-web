export default {
  props: {
    calendar: {
      default: () => new Date()
    },
    clickFunction: {
      type: Function
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false
      }
    }
  },
  data() {
    return {
      enterActiveClass: "",
      leaveActiveClass: "",
      visible: false,
      closed: false,
      date: new Date()
    }
  },
  methods: {
    destroyElement() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    nextClose() {
      this.leaveActiveClass = "fadeOutLeft"
      this.closed = true
    },
    prevClose() {
      this.leaveActiveClass = "fadeOutRight"
      this.closed = true
    },
    close() {
      this.closed = true
    }
  }
}
