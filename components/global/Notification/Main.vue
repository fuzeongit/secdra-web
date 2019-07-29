<template>
  <transition name="fade" enter-active-class="fadeInRight duration" leave-active-class="fadeOut duration"
              @after-leave="destroyElement">
    <div class="card" :style="{top:`${verticalOffset}px`}" v-show="visible">
      <div class="flex-box">
        <div class="title">
          {{title}}
        </div>
        <div>
          <Btn flat icon small @click.stop="close">
            <i class="icon s-close"></i>
          </Btn>
        </div>
      </div>
      <div class="message">
        {{message}}
      </div>
    </div>
  </transition>
</template>

<script>
  import dialogMixin from "../../../assets/script/mixin/dialogMixin"
  import {on} from "../../../assets/script/util/domUtil";

  export default {
    componentName: "Notification",
    mixins: [dialogMixin],
    data() {
      return {
        title: "提示",
        Message: "",
        verticalOffset: 0,
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
        window.setTimeout(() => {
          this.close()
        }, this.waitTime)
      }
    },
    methods: {
      close() {
        this.closed = true;
        window.clearTimeout(this.closeTimeout);
        this.callback && this.callback()
      }
    },
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
    display: inline-block;
    right: 15px;
    z-index: @mask-index + 1;
    margin: 0 auto 0 -(@size / 2);
    transition: all @default-animate-time;
    padding: 15px;
    .title {
      .ellipsis();
      text-align: left;
      width: 100%;
    }
    .message {
      margin-top: 8px;
      font-size: @small-font-size;
    }
  }
</style>
