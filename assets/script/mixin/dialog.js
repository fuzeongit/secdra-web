import {on, off} from "../../../assets/script/util/domUtil"

export default {
  props: {
    persistent: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        this.$emit("change", false);
      }
    }
  },
  data() {
    return {
      persistentAnimate: false,
    };
  },
  methods: {
    destroyElement() {
      off(document, "keydown", this.onEsc);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    onEsc(event) {
      if (event.keyCode === 27) {
        this.onPersistent()
      }
    },
    onPersistent() {
      if (this.persistent) {
        this.persistentAnimate = true;
        return false
      }
      this.close()
    },
    persistentAnimationend() {
      this.persistentAnimate = false
    }
  }
}
