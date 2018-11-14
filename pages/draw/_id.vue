<template>
  <div class="page">
    <div class="content row">
      <div class="left-box">
        <div class="card img-card flex-box">
          <img :src="$img.scedra(draw.url)"
               :style="{height:proportion>1?`100%`:`auto`,width:proportion<1?`100%`:`auto`}">
      </div>
      </div>
      <div class="right-box">
        <div class="card user-card ">
          <div class="user-bk cover" :style="{backgroundImage: `url(${$img.back(draw.user.background,`imageMogr2/thumbnail/1920x/gravity/Center/crop/1920x960/blur/1x0/quality/75|imageslim`,true)})`}">

          </div>
          <div class="padding-15">
            <div class="flex-box">
              <nuxt-link :to="`/user/${draw.user.id}`" class="head-box center">
                <img :src="$img.head(draw.user.head)" >
              </nuxt-link>
              <div style="width: 100%">
                <p class="nickname">
                  {{draw.user.name}}
                </p>
                <!--<p>-->

                <!--</p>-->
              </div>
            </div>
            <div style="margin-top: 20px;">
              <button class="btn block">关注</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from "../../assets/js/config";

  export default {
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "";
      let id = route.params.id;
      let res = await $axios.get(`${config.host}/draw/get`, {
        params: {id}
      });
      let rusult = res.data;
      if (rusult.status !== 200) {
        throw new Error(rusult.message)
      }
      return {
        draw: rusult.data
      }
    },
    computed: {
      proportion() {
        return this.draw.height / this.draw.width
      }
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../assets/style/color";
  @import "../../assets/style/config";
  @import "../../assets/style/mixin";

  .page {
    padding: 24px 0;
  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    .left-box {
      width: 850px;
      float: left;
      .img-card {
        height: 800px;
      }
    }
    .right-box {
      @width:250px;
      width: @width;
      float: right;
      .user-bk{
        height:  @width / 2;
      }
      .head-box {
        @head-img-height: 80px;
        @head-img-border: 2px;
        img{
          height: @head-img-height;
          width: @head-img-height;
          border: @head-img-border solid @white;
          border-radius: 50%;
        }
      }
      .nickname{
        .ellipsis()
      }
    }
  }
</style>
