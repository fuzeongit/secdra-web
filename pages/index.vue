<template>
  <div class="page" >
    <div class="content row">
      <div class="left-box">
        <div class="card image-card ">
          <h3 class="title">
            发现
            <nuxt-link to="/find">
              更多>>
            </nuxt-link>
          </h3>
          <div class="row">
            <div v-for="(draw,index) in likeList" class="item" :key="index">
              <nuxt-link :to="`/draw/${draw.id}`" class="cover img"
                         :style="{backgroundImage: `url(${$img.scedra(draw.url,'specifiedWidth')})`}"
                         style="width: 100%">
              </nuxt-link>
              <p class="user-name center" >
                <nuxt-link :to="`/user/${draw.userId}`" >
                  <span @mouseenter="mouseenter">
                      {{draw.name}}
                  </span>
                </nuxt-link>
              </p>
              <p class="introduction">
                {{draw.introduction}}
              </p>
            </div>
          </div>
        </div>
        <div class="card image-card " style="margin-top: 20px;">
          <h3 class="title">
            最新
            <nuxt-link to="/new">
              更多>>
            </nuxt-link>
          </h3>
          <div class="row">
            <div v-for="(draw,index) in newList" class="item" :key="index">
              <nuxt-link :to="`/draw/${draw.id}`" class="cover img"
                         :style="{backgroundImage: `url(${$img.scedra(draw.url,'specifiedWidth')})`}"
                         style="width: 100%">
              </nuxt-link>
              <p class="user-name center">
                <nuxt-link :to="`/user/${draw.userId}`" @mouseenter="mouseenter">
                  {{draw.name}}
                </nuxt-link>
              </p>
              <p class="introduction">
                {{draw.introduction}}
              </p>
            </div>
          </div>
        </div>
      </div>
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
      taskList.push($axios.get(`${config.host}/draw/pagingByRecommend`, {params: new Pageable(0, 10)}));
      taskList.push($axios.get(`${config.host}/draw/paging`, {params: new Pageable(0, 10, "createDate,desc")}));
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
      console.log(this.extend)
    },
    methods: {
      mouseenter($event){
        console.log($event)
      }
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

    .card {
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
    }
    .left-box {
      width: 850px;
      float: left;
      .activity-card {

      }
      .image-card {
        padding: 10px 9px;
        .row {
          margin-top: 8px;
          .item {
            margin: 12px 8px;
            float: left;
            width: 150px;
            .cover {
              display: block;
              width: 100%;
              height: 150px;
            }
            .user-name {
              margin-top: 10px;
              font-size: @default-font-size;
              font-weight: 600;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .introduction {
              font-size: @small-font-size;
              line-height: 20px;
              color: @gray;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
              max-height: 40px;
            }
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
  }
</style>
