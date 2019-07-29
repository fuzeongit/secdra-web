<template>
  <transition name="fade" enter-active-class="fadeIn mask-duration" leave-active-class="fadeOut  mask-duration">
    <div class="mask" v-show="visible" @click="onPersistent">
      <transition name="zoom" enter-active-class="zoomIn duration" leave-active-class="zoomOut duration"
                  @after-leave="destroyElement">
        <div class="card" :class="{bounceIn:persistentAnimate,duration:persistentAnimate}" v-show="visible"
             @animationend="persistentAnimationend()" @click.stop="_=>{}">
          <h3>
            {{title}}
          </h3>
          <p>
            {{message}}
          </p>
          <div class="btn-group">
            <Btn flat color="primary" @click.stop="close">
              {{noDesc}}
            </Btn>
            <Btn flat color="primary" @click.stop="ok">
              {{okDesc}}
            </Btn>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import dialogMixin from "../../../assets/script/mixin/dialogMixin"
  import {on, addClass} from "../../../assets/script/util/domUtil";

  export default {
    componentName: "Confirm",
    mixins: [dialogMixin],
    data() {
      return {
        visible: false,
        closed: false,
        title: "提示",
        okDesc: `确定`,
        noDesc: `取消`,
        okCallback: function () {
        },
        noCallback: function () {
        }
      }
    },
    methods: {
      ok() {
        this.closed = true;
        this.okCallback && this.okCallback(this)
      },
      close() {
        this.closed = true;
        this.noCallback && this.noCallback(this)
      }
    },
    mounted() {
      on(document, "keydown", this.onEsc);
      addClass(document.body, "not-scroll");
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";

  .card {
    width: 450px;
    margin: 0 auto;
    vertical-align: middle;
    display: inline-block;
    padding: 15px;
    h3 {
      text-align: left;
      line-height: 40px;
    }
    p {
      text-align: left;
      padding: 10px 0;
      line-height: 25px;
      color: @gray;
    }
    .btn-group {
      margin-top: 10px;
      text-align: right;
    }
  }
</style>
