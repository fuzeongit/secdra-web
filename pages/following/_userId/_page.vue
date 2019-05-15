<template>
  <div class="page">
    <div class="content row">
      <div class="card" v-for="(item,index) in list" :key="index">
        <div class="cover"
             :style="{backgroundImage: `url(${$img.back(item.background,`backCard`)})`}">
        </div>
        <nuxt-link :to="`/user/${item.id}`" class="head-box center">
          <img :src="$img.head(item.head,'small200')">
        </nuxt-link>
        <div class="user-info-box center ">
          <p class="nickname">
            {{item.name}}
          </p>
          <p class="introduction" :title="item.introduction">
            {{item.introduction}}
          </p>
        </div>
      </div>
    </div>
    <br>
    <Pageable :totalPage="page.totalPages" :currPage="pageable.page" @go="paging"></Pageable>
  </div>
</template>

<script>
  import config from "../../../assets/script/config/index";
  import {Pageable} from "../../../assets/script/model/base";

  export default {
    //在这里不能使用httpUtil
    //并且嵌套层数超过不知道多少会报错-->坑死我了
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "following";
      let pageable = new Pageable(route.params.page * 1 || 0,16,"createDate,desc");
      let {data: result} = await $axios.get(`${config.host}/following/paging`, {
        params: Object.assign({
          id: route.params.userId
        },pageable)
      });
      if (result.status !== 200) {
        throw new Error(result.message)
      }
      return {
        pageable:pageable,
        page: result.data,
        list: result.data.content
      }
    },
    methods: {
      paging(page){
        this.$router.push(`/following/${this.$route.params.userId}/${page}`);
      },
    }
  }
</script>

<style type="text/less" lang="less" scoped>
  @import "../../../assets/style/color";
  @import "../../../assets/style/config";
  @import "../../../assets/style/mixin";

  .content {
    width: @visual-width;
    margin: 0 auto;
    .card {
      @size: 250px;
      float: left;
      margin-top: 24px;
      margin-right: 24px;
      transition: @default-animate-time;
      overflow: hidden;
      width: @size;
      &:nth-child(4n+1) {
        margin-left: 24px;
      }
      .cover {
        height: @size /2;
        width: @size;
        transition: @default-animate-time;
      }
      .head-box {
        padding: 10px;
        display: block;
        img {
          border-radius: 50%;
          width: 80px;
          height: 80px;
          border: 2px solid @white;
          transition: @default-animate-time;
        }
      }
      .user-info-box {
        padding: 0 20px 20px 20px;
        transition: @default-animate-time;
        .nickname {
          .ellipsis()
        }
        .introduction {
          font-size: @smallest-font-size;
          margin-top: 10px;
          .ellipsis()
        }
      }
      &:hover {
        .cover {
          filter: blur(60px);
        }
        .head-box {
          img {
            transform: translateY(-25px) scale(2);
          }
        }
        .user-info-box {
          opacity: 0;
          transform: translateY(25px);
        }
        transform: translateY(-1px);
        box-shadow: 0 0 50px rgba(150, 150, 150, 0.55);
      }
    }
  }
</style>
