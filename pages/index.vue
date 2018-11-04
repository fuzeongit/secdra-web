<template>
  <div class="page">
    <div class="content row">
      <div class="card image-card">

      </div>
      <!--<div class="card tag-card">-->
      <!--<div class="tag-first">-->
      <!--<img :src="$img.get(tagList[0].url,'specifiedWidth300')">-->
      <!--</div>-->
      <!--<div class="tag-list row">-->
      <!--<div class="tag" v-for="(tag,index) in tagList" :key="index" v-if="index !== 0">-->
      <!--<img :src="$img.get(tag.url,'clipping100')">-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <div class="card tag-card">
        <h3 class="title">
          推荐标签
          <nuxt-link to="/">
            更多>>
          </nuxt-link>
        </h3>
        <div class="tag-list">
          <button class="btn is-plain" v-for="(tag,index) in tagList" @click="search(tag.name)"> {{tag.name}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"
  import config from "../assets/js/config";

  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "home";
      let res = await $axios.get(`${config.host}/tag/listTagOrderByLikeAmount`);
      let result = res.data || {};
      return {
        tagList: result.data
      }
    },
    data() {
    },
    computed: {
      user() {
        return this.$store.state.user.user || {}
      }
    },
    mounted() {

    },
    methods: {
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../assets/style/color";
  @import "../assets/style/config";

  .page {
    padding: 30px 0;

  }

  .content {
    width: @visual-width;
    margin: 0 auto;
    .image-card {
      width: 750px;
      margin-right: 20px;
      float: left;
    }
    /*  .tag-card {
        @spacing:10px;
         width: 250px;
         float: left;
         padding: @spacing;
         .tag-first{
           padding-bottom:@spacing;
           width: 100%;
           img {
             width: 100%;
           }
         }
         .tag-list {
           width: 100%;
           margin-bottom: -@spacing;
           .tag{
             float: left;
             width: calc((100% - @spacing) / 2);
             padding-bottom: @spacing;
             &:nth-child(2n-1){
               margin-right: @spacing;
             }
             img {
               width: 100%;
             }
           }
         }
    }*/

    .tag-card {
      @spacing: 10px;
      width: 250px;
      float: left;
      padding: @spacing;
      .title {
        font-size: @medium-font-size;
        padding-left: 10px;
        line-height: @medium-font-size;
        border-left: 5px solid @theme-color;
        a{
          line-height: 16px;
          vertical-align: baseline;
          display: inline-block;
          float: right;
          color:@theme-color
        }
      }
      .tag-list {
        margin-top: @spacing * 2;
        margin-bottom: -@spacing;
        .btn {
          margin-right: @spacing;
          margin-bottom: @spacing;
          line-height: 25px;
          padding: 0 2em;
        }
      }
    }
  }
</style>
<style>

</style>
