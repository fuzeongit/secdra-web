import {on, off} from "../../../assets/script/util/domUtil"

export default {
  data() {
    return {
      scrollTop: 0,
      scrollBottom: 0,
      _requestAnimationFrameTick:false
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
      if(!this._requestAnimationFrameTick) {
        requestAnimationFrame(()=>{
          this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
          this.scrollBottom = document.body.scrollHeight - this.scrollTop - event.target.documentElement.clientHeight;
          this._requestAnimationFrameTick = false;
        });
        this._requestAnimationFrameTick = true;
      }
    },
  }
}
