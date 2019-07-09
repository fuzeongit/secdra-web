<template>
  <transition name="fade" enter-active-class="fadeInDown duration" leave-active-class="fadeOutUp duration">
    <div class="card" v-show="visible">
      <div class="flex-box">
        <p class="message">
          {{message}}
        </p>
        <div>
          <Btn flat icon small @click.stop="close">
            <i class="icon s-close"></i>
          </Btn>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import dialogMixin from "../../../assets/script/mixin/dialog"
  import {on} from "../../../assets/script/util/domUtil";

  export default {
    componentName: "Message",
    mixins: [dialogMixin],

    data() {
      return {
        closeTimeout: null,
        waitTime: 5000,
        visible: false,
        closed: false,
        callback: () => {
        }
      }
    },
    mounted() {
      on(document, "keydown", this.onEsc);
      if (this.waitTime) {
        this.closeTimeout = setTimeout(() => {
          this.close()
        }, this.waitTime)
      }
    },
    methods: {
      close() {
        this.closed = true;
        window.clearTimeout(this.closeTimeout);
        this.callback && this.callback(this);
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .card {
    @size: 300px;
    width: @size;
    position: fixed;
    z-index: @mask-index + 1;
    display: inline-block;
    top: 20px;
    left: 50%;
    margin: 0 auto 0 -(@size / 2);
    padding: 15px;
    .message {
      .ellipsis();
      text-align: left;
      width: 100%;
      font-size: @small-font-size;
    }
  }
</style>
