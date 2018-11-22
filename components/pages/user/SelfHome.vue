<template>
  <div>
    <div class="user-bk cover"
         :style="{transform: `translateY(${scrollTop*.5}px)`,backgroundImage: `url(${$img.back(user.background)})`}">
      <div class="user-bk-content"></div>
    </div>
    <div class="content card" :style="{marginTop:`-100px`}">
      <div class="head-box">
        <a>
          <img :src="$img.head(user.head)"
               :onerror="`this.src='${require('../../../assets/image/default/default-head.jpg')}'`">
        </a>
        <div style="height: 3000px">
          <button class="btn" @click="click">{{$route.params.id}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Popper from '../../global/Popper'

  export default {
    computed: {
      user() {
        return this.$store.state.user.user || {}
      },
      scrollTop: {
        get() {
          return this.$store.state.window.scrollTop || 0
        },
        set(val) {
          this.$store.state.window.scrollTop = val || 0
        }
      }
    },
    components: {
      Popper
    },
    methods: {
      click() {
      }
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";

  .user-bk {
    width: 100%;
    margin-top: -@herder-height;
    height: @window-min-width / 2;
    /*background-image: url("../../../assets/image/bk/login-bk.jpg");*/
    .user-bk-content {
      padding-top: @herder-height;
      width: 100%;
      height: 100%;
    }
  }

  @media-width-1: 1529px;
  @media-width-2: 1276px;

  @media only screen and (min-width: @media-width-1) {
    .user-bk {
      height: @media-width-1 / 2;
    }
  }

  @media only screen and (max-width: @media-width-1) and (min-width: @media-width-2) {
    .user-bk {
      height: @media-width-2 / 2;
    }
  }

  @media screen and (max-width: @media-width-2) {
    .user-bk {
      height: @window-min-width / 2;
    }
  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    @head-img-height: 150px;
    @head-img-border: 2px;
    transform: translateY(0);
    .head-box {
      padding: 0 100px 20px;
      img {
        transform: translateY(-(@head-img-height+@head-img-border)/2);
        height: @head-img-height;
        width: @head-img-height;
        border: @head-img-border solid @white;
        border-radius: 50%;
      }
    }
  }
</style>
