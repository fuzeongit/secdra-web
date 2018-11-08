<template>
  <div class="page">
    <div class="content row">
      <div class="left-box">
        <div class="card image-card row">
          <div v-for="(draw,index) in likeList" class="item" :key="index">
            <div class="cover img" :style="{backgroundImage: `url(${$img.scedra(draw.url,'specifiedWidth')})`}"
                 style="width: 100%">
            </div>
            <p>
              {{draw.user.name}}
            </p>
          </div>
        </div>
        <div class="card image-card row" style="margin-top: 20px;">
          <div v-for="(draw,index) in newList" class="item" :key="index">
            <div class="cover img" :style="{backgroundImage: `url(${$img.scedra(draw.url,'specifiedWidth')})`}"
                 style="width: 100%">
            </div>
            <p>
              {{draw.user.name}}
            </p>
          </div>
        </div>
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
      <div class="right-box">
        <div class="card tag-card">
          <h3 class="title">
            推荐标签
            <nuxt-link to="/">
              更多>>
            </nuxt-link>
          </h3>
          <div class="tag-list">
            <nuxt-link class="btn is-plain" v-for="(tag,index) in tagList" :to="`/draw/search/${tag.name}`"
                       :key="index"> {{tag.name}}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from "../assets/js/config";
  import {Pageable} from "../assets/js/model/base";

  export default {
    //在这里不能使用httpUtil
    async asyncData({store, req, redirect, route, $axios}) {
      store.state.menu.name = "home";
      let taskList = [];
      taskList.push($axios.get(`${config.host}/tag/listTagOrderByLikeAmount`));
      taskList.push($axios.get(`${config.host}/draw/pagingByTag`, {params:  new Pageable(0,10,"likeAmount,desc")}));
      taskList.push($axios.get(`${config.host}/draw/pagingByTag`, {params: new Pageable(0,10,"createDate,desc")}));
      let resultList = (await Promise.all(taskList)).map(item => item.data);
      return {
        tagList: resultList[0].data,
        likeList: resultList[1].data.content,
        newList: resultList[2].data.content,
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
    methods: {}
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
    .left-box {
      width: 850px;
      float: left;
      .activity-card {

      }
      .image-card {
        padding: 16px 9px;
        .item {
          margin: 8px;
          float: left;
          width: 150px;
          .cover {
            width: 100%;
            height: 150px;
          }
        }
      }
    }
    .right-box {
      width: 250px;
      float: right;
      .tag-card {
        @spacing: 10px;
        padding: @spacing;
        .title {
          font-size: @medium-font-size;
          padding-left: 10px;
          line-height: @medium-font-size;
          border-left: 5px solid @theme-color;
          a {
            line-height: 16px;
            vertical-align: baseline;
            display: inline-block;
            float: right;
            color: @theme-color
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

  }
</style>
<style>

</style>
